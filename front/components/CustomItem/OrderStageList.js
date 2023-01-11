import { useSetState } from "ahooks";
import { Button, Checkbox, InputNumber, message, Tabs } from "antd";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { multicallWrite, muticallEncode, useContracts, useRead, useSignAppendData, useSignPermit2Data } from "../../controller";
import { startOrder, updatedStage } from "../../http/_api/order";
import OutputStageCard from "../CustomCard/OutputStageCard";
import AppendStage from "./AppendStage";
import { BigNumber } from '@ethersproject/bignumber'
import { Sysmbol } from "../../utils/Sysmbol";
import { ConvertToken, Currency } from "../../utils/Currency";


export default function OrderStageList(params) {
    
    const { order, dataStages, task, permit2Nonce } = params;
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
    const { useDeOrderVerifierRead: nonces } = useRead('nonces', [address, Number(order.order_id)]);
    // 领钱
    const { useOrderContractWrite: getWithdraw } = useContracts('withdraw');

    // permit2
    let [signature,setSignature] = useState();
    let [permit2Ready, setPermit2Ready] = useState(false);
    let [permit2, setPermit2] = useState({});  //  permit2
    let [permitDeadline, setPermitDeadline] = useState();
    const { useSign: permit2Sign, obj: permit2Obj } = useSignPermit2Data(permit2);  //  permit2

    // 领钱
    const withdraw = () => {
        setIsLoading(true);
        getWithdraw.write({
            recklesslySetUnpreparedArgs: [Number(order.order_id), address]
        })
    }

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

    // 判断nonce是否为最新 || signature 是否过期
    const inspection = () => {
        const now = parseInt(new Date().getTime()/1000);
        if (order.stages.deadline < now) {
            updatedStage({order_id: order.order_id, status: 'InvalidSign'})
            .then(res => {
                if (res.code === 0) {
                    message.warning("对方签名已失效!")
                    setTimeout(() => {
                        history.go(0)
                    }, 500);
                }
            })
            message.warning("对方签名已失效!")
            return false
        }else{
            return true
        }
    }

    // 发起新增
    const updateAppend = () => {
        if (order.status === 'WaitProlongAgree') {
            message.warning('请先确认「延期申请」')
            return
        }
        setIsLoading(true);

        let now = parseInt(new Date().getTime()/1000);
        let setTime = 2 * 24 * 60 * 60;
        deadline = now+setTime;
        setDeadline(deadline);
        appendParams = {
            chainId: chain.id,  //  id
            orderId: order.order_id,
            amount: Currency(order.currency, appendObj.amount),
            period: appendObj.period * 24 * 60 * 60,
            payType: 1,     //  TODO ==> 临时变量
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
            amount: Currency(order.currency, cache.amount),
            period: cache.period * 24 * 60 * 60,
            nonce: Number(nonces.data.toString()),    //  id nonce form sql? or chain
            deadline: `${deadline}`,
        }
        setAppendParams({...appendParams});

        setAppendReady(true);
    }

    // 甲方同意新增
    const payAppend = () => {
        if (!inspection()) {
            return
        }
        if (order.currency !== ethers.constants.AddressZero && !signature) {
            // 发起permit2签名
            permit2Get()
            return
        }
        let data = dataStages[dataStages.length-1];
        let amount = Currency(order.currency, data.amount);
        let arr = [];
        if (order.currency !== ethers.constants.AddressZero) {
            arr.push({
                functionName: 'payOrderWithPermit2',
                params: [
                    order.order_id, 
                    amount, 
                    {
                        permitted: {
                            token: order.currency,        //  dUSDT
                            amount: amount
                        },
                        nonce: permit2Nonce.toString(),
                        deadline: `${permitDeadline}`
                    },
                    signature
                ]
            })
        }else{
            arr.push({
                functionName: 'payOrder',
                params: [order.order_id, amount]
            })
        }
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
        console.log(arr);
        let params = muticallEncode(multicall);
        if (order.currency !== ethers.constants.AddressZero) {
            amount = 0
        }
        multicallWrite(params,address,amount)
        .then(res => {
            if (res) {
                //  更新数据库状态
                updatedStage({
                    order_id: order.order_id,
                    hash: res,
                    status: 'AgreeAppend'
                })
                .then(res => {
                    handelRes(res)
                })
            }
        })
    }

    const permit2Get = () => {
        // 签名 ==> TODO: ==>
        let data = dataStages[dataStages.length-1];
        let amount = Currency(order.currency, data.amount);
        let now = parseInt(new Date().getTime()/1000);
        let setTime = 60 * 60;
        permitDeadline = now+setTime;
        setPermitDeadline(permitDeadline);
        permit2 = {
            chainId: chain.id,
            token: order.currency,        //  dUSDT
            amount: amount,
            spender: Sysmbol().DeOrder,
            nonce: permit2Nonce.toString(),
            deadline: `${permitDeadline}`
        }
        setPermit2({...permit2});
        setPermit2Ready(true);
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

    // 发起permit2签名
    useEffect(() => {
        if (permit2.chainId && permit2Ready) {
            permit2Sign.signTypedDataAsync()
            .then(res => {
                signature = res;
                setSignature(signature);
                if (res) {
                    payAppend();
                }
            })
            .catch(err => {
                // setIsLoading(false)
            })
        }
    },[permit2])

    useEffect(() => {
        if (chainStages.data && data.length === 0) {
            let deliveryDate = 0;
            dataStages.map((e,i) => {
                deliveryDate += e.period;
                e.deliveryDate = deliveryDate;
            })
            data = dataStages;
            chainStages.data.map((e,i) => {
                data[i].amount = ConvertToken(order.currency,e.amount.toString());
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
            console.log('appendSign ==> ',appendSign);
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

    // 领钱成功
    useEffect(() => {
        if (getWithdraw.isSuccess) {
            message.success("操作成功")
            setIsLoading(false);
            startOrder({
                order_id: order.order_id
            })
            .then(res => {
                handelRes(res)
            })
        }
    },[getWithdraw.isSuccess])

    // 领钱失败
    useEffect(() => {
        if (getWithdraw.error) {
            message.error('error')
            setIsLoading(false);
        }
    },[getWithdraw.error])
    

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

                    <div className="flex">
                        <div className="prepay">
                            {dataStages[0].amount}  
                        </div> 
                        <Button loading={isLoading} onClick={() => withdraw()}>Withdraw money</Button>
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
                    inspection={inspection}
                />
                {
                    isAppend ? 
                    <div className="tabs new-tabs">
                        <p className="tabs-title">P{dataStages[0].period === 0 ? dataStages.length : dataStages.length + 1}</p>
                        <AppendStage 
                            setInner={setAppendObj} 
                            inner={appendObj}
                            cancel={setIsAppend}
                            updateAppend={updateAppend}
                            isLoading={isLoading}
                        />
                    </div>
                    :
                    order.progress === 2 && order.status !== 'WaitAppendAgree' && 
                    <Button className="btn-add mb60" onClick={() => setIsAppend(true)}>Establish</Button>
                }

            </div>
        </div>
    )
}