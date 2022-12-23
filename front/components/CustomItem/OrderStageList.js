import { useSetState } from "ahooks";
import { Button, Checkbox, InputNumber, message, Tabs } from "antd";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { multicallWrite, muticallEncode, useRead, useSignAppendData } from "../../controller";
import { updatedStage } from "../../http/_api/order";
import OutputStageCard from "../CustomCard/OutputStageCard";
import AppendStage from "./AppendStage";



export default function OrderStageList(params) {
    
    const { order, dataStages, task } = params;
    const { address } = useAccount();
    const { chain } = useNetwork();
    let [data, setData] = useState([]);
    let [stageIndex, setStageIndex] = useState(0);

    let [isLoading, setIsLoading] = useState(false);
    let [deadline, setDeadline] = useState();
    let [isAppend, setIsAppend] = useState(false);
    let [appendObj, setAppendObj] = useState({name: '', period: '', amount: '', desc: ''});  //  新增
    let [appendParams, setAppendParams] = useState({});
    let [appendReady, setAppendReady] = useState(false);
    let [multicall, setMulticall] = useState();
    const { useSign: appendSign, obj: appendConfig } = useSignAppendData(appendParams);  //  延长签名

    const { useStageRead: chainStages } = useRead('getStages',order.order_id);
    const { useStageRead: chainOngoing } = useRead('ongoingStage',order.order_id);
    const { useOrderRead: nonces } = useRead('nonces', address);

    // 请求返回处理
    const handelRes = (res) => {
        if (res.code === 0) {
            message.success(res.msg)
            setTimeout(() => {
                history.go(0)
            }, 500);
        }else{
            message.error(res.msg)
            setIsLoading(false)
        }
    }

    // 发起新增
    const updateAppend = () => {
        setIsLoading(true);

        let now = parseInt(new Date().getTime()/1000);
        let setTime = 2 * 24 * 60 * 60;
        deadline = now+setTime;
        setDeadline(deadline);
        appendParams = {
            chainId: chain.id,  //  id
            orderId: order.order_id,
            amount: ethers.utils.parseEther(`${appendObj.amount}`),
            period: appendObj.period * 24 * 60 * 60,
            nonce: Number(nonces.data.toString()),    //  id nonce form sql? or chain
            deadline: `${deadline}`,
        }
        setAppendParams({...appendParams});

        setAppendReady(true);
    }
    // 乙方同意新增
    const agreeAppend = () => {
        let cache = dataStages[dataStages.length-1];
        setIsLoading(true);

        let now = parseInt(new Date().getTime()/1000);
        let setTime = 2 * 24 * 60 * 60;
        deadline = now+setTime;
        setDeadline(deadline);
        appendParams = {
            chainId: chain.id,  //  id
            orderId: order.order_id,
            amount: ethers.utils.parseEther(`${cache.amount}`),
            period: cache.period * 24 * 60 * 60,
            nonce: Number(nonces.data.toString()),    //  id nonce form sql? or chain
            deadline: `${deadline}`,
        }
        setAppendParams({...appendParams});

        setAppendReady(true);
    }

    // 甲方同意新增
    const payAppend = () => {
        let data = dataStages[dataStages.length-1];
        let amount = ethers.utils.parseEther(`${data.amount}`);
        let arr = [];
        arr.push({
            functionName: 'payOrder',
            params: [order.order_id, amount]
        })
        arr.push({
            functionName: 'appendStage',
            params: [
                order.order_id, 
                amount,
                (data.period * 24 * 60 * 60), 
                order.sign_nonce, 
                order.stages.deadline,
                '0x' + order.signature.substring(2).substring(128, 130),
                '0x' + order.signature.substring(2).substring(0, 64),
                '0x' + order.signature.substring(2).substring(64, 128)
            ]
        })
        multicall = arr;
        setMulticall([...multicall]);
        let params = muticallEncode(multicall);
        multicallWrite(params,address,amount)
        .then(res => {
            console.log('multicall ==> ', res);
            //  更新数据库状态
            updatedStage({
                order_id: order.order_id,
                hash: res,
                status: 'AgreeAppend'
            })
            .then(res => {
                handelRes(res)
            })
        })
    }

    // 更新阶段
    const update = (signature,status) => {
        // stages添加阶段
        let json = order.stage_json;
        let arr = {
            amount: [],period: [],deadline: ''
        };
        if (appendObj.name) {
            json.stages.push({
                milestone: {
                    type: 'raw',
                    content: appendObj.desc,
                    title: appendObj.name
                },
                delivery: {
                    attachment: '',
                    fileType: '',
                    content: ''
                }
            })
        }
        arr.deadline = deadline;
        dataStages.map((e,i) => {
            arr.amount.push(e.amount);
            arr.period.push(e.period);
        })
        if (appendObj.name) {
            arr.amount.push(appendObj.amount);
            arr.period.push(appendObj.period);
        }

        updatedStage({
            signature: signature,
            sign_address: address,
            sign_nonce: Number(nonces.data.toString()),
            obj: JSON.stringify(json),
            order_id: order.order_id,
            stages: JSON.stringify(arr),
            status: status
        })
        .then(res => {
            handelRes(res)
        })
    }

    // 选择添加阶段展示
    const switchAppend = () => {
        if (order.sign_address === address) {
            // 是我发起的添加阶段
            
        }else{
            // 不是我发起的添加阶段
        }
    }

    useEffect(() => {
        if (chainStages.data && data.length === 0) {
            let deliveryDate = 0;
            dataStages.map((e,i) => {
                deliveryDate += e.period;
                e.deliveryDate = deliveryDate;
            })
            data = dataStages;

            chainStages.data.map((e,i) => {
                data[i].amount = e.amount.toString() / Math.pow(10,18);
                data[i].period = e.period.toString() / (24 * 60 * 60);
                data[i].status = e.status;
            })
            setData([...data]);
            console.log('data ==>',data);
        }
    },[chainStages.data])

    useEffect(() => {
        if (chainOngoing.data) {
            let going = chainOngoing.data;
            stageIndex = Number(going.stageIndex.toString());
            setStageIndex(stageIndex);
            console.log('ongoing ==> ',going.stageIndex.toString());
        }
    },[chainOngoing.data])

    // 发起签名
    useEffect(() => {
        if (appendConfig.chainId && appendReady) {
            appendSign.signTypedDataAsync()
            .then(res => {
                update(res, 'WaitAppendAgree')
                // 修改data ==> 上传后端更新
            })
            .catch(err => {
                setIsLoading(false)
            })
        }
    },[appendParams])

    return (
        <div className="stageCard">
            <p className="title">Task stage division</p>
            {
                // 预付款
               order.worker === address && order.stages.period[0] === 0 &&

               <div className="payModel">
                    <Checkbox checked disabled>
                        Increase advance payment
                    </Checkbox>
                    <div className="prepay">
                        {dataStages[0].amount}
                    </div> 
                </div>
            }
            <div className="stageList">
                <OutputStageCard 
                    isEdit="none" 
                    data={data} 
                    stageIndex={stageIndex} 
                    who={order.issuer === address ? 'issuer' : 'worker'} 
                    oid={order.order_id}
                    task={task}
                    order={order}
                    agreeAppend={agreeAppend}
                    payAppend={payAppend}
                />
                {
                    isAppend ? 
                    <div className="tabs new-tabs">
                        <p className="tabs-title">P{dataStages.length + 1}</p>
                        <AppendStage 
                            setInner={setAppendObj} 
                            inner={appendObj}
                            cancel={setIsAppend}
                            updateAppend={updateAppend}
                            isLoading={isLoading}
                        />
                    </div>
                    :
                    order.progress === 4 && order.status !== 'WaitAppendAgree' && 
                    <Button className="btn-add mb60" onClick={() => setIsAppend(true)}>Establish</Button>
                }
                {
                    order.status === 'WaitAppendAgree' && switchAppend()
                }

            </div>
        </div>
    )
}