import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useSetState } from "ahooks";
import { Button, Checkbox, InputNumber, message, Modal } from "antd";
import { ethers } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react"
import { useAccount, useNetwork } from "wagmi";
import { multicallWrite, muticallEncode, useRead, useSignData } from "../../controller";
import { startOrder, updatedStage } from "../../http/_api/order";
import { getDate } from "../../utils/GetDate";
import InnerStageCard from "../CustomCard/InnerStageCard";

export default function OrderSetStage(params) {
    
    const { search, order, amount, task, dataStages } = params;
    const { confirm } = Modal;
    let [progressSet, setProgressSet] = useState();
    let [stage, setStage] = useSetState({
        orderModel: false,      //  预付款模式
    });
    let [stages, setStages] = useState({
        amount: [], period: [], deadline: ''
    })
    let [inner, setInner] = useState();     //  阶段划分
    const { chain } = useNetwork();
    const { address } = useAccount();

    // 链上数据
    const { useOrderRead: nonces } = useRead('nonces', address);

    // 签名部分
    let [signObj,setSignObj] = useState({});    //  签名信息
    const { useSign, obj } = useSignData(signObj);
    let [isSigner,setIsSigner] = useState(false);

    let [isChange,setIsChange] = useState(false);   //  是否修改了阶段划分

    // 设置阶段按钮
    let [btnDisabled,setBtnDisabled] = useState(true);
    let [isLoading,setIsLoading] = useState(false);
    
    //  切换order模式 ==> 预付款
    const toggleModel = (e) => {
        setStage({orderModel: e.target.checked})
    }

    //  获取阶段划分
    const getInner = (obj) => {
        inner = obj;
        setInner({...inner});

        // 参数空指针判断
        let flag = true;
        for (const i in inner) {
            for (const j in inner[i]) {
                if (!inner[i][j]) {
                    flag = false
                }
            }
        }
        if (flag) {
            setBtnDisabled(false);
        }else{
            setBtnDisabled(true);
        }
    }

    //  设置阶段 ==> 处理签名信息
    const sendSignature = () => {
        let now = parseInt(new Date().getTime()/1000);
        let setTime = 2 * 24 * 60 * 60;
        stages.deadline = now+setTime;
        setStages({...stages});

        let _amount = [];
        let _period = [];
        let arr = [];
        for (const i in inner) {
            arr.push(inner[i]);
        }
        arr.map(e => {
            _amount.push(ethers.utils.parseEther(`${e.amount}`))
            _period.push(`${e.period * 24 * 60 * 60}`)
        })
        
        signObj = {
            amounts: _amount,
            periods: _period,
            chainId: chain.id,
            address: address,
            oid: search.order_id,
            nonce: nonces.data.toString(),
            deadline: stages.deadline
        }
        setSignObj({...signObj})
        setIsSigner(true)
    }

    // 签名成功 ==>
    const signSuccess = () => {
        setIsSigner(false);
        let stageDetail = {
            orderId: search.order_id,
            stages: [],
            task: {
                id: task.task_id,
                title: task.title,
                desc: task.desc,
                attachment: task.attachment,
            },
            // last: stagejson, //  jsonhash
            last: '', //  jsonhash
            version: '1.0'
        };
        let arr = [];
        let _amount = [];
        let _period = [];
        for (const i in inner) {
            arr.push(inner[i]);
        }
        arr.map(e => {
            _amount.push(e.amount);
            _period.push(e.period);
            stageDetail.stages.push({
                milestone: {
                    type: 'raw',
                    content: e.desc,
                    title: e.name
                },
                delivery: {
                    attachment: '',
                    fileType: '',
                    content: ''
                }
            })
        })
        stages.amount = _amount;
        stages.period = _period;
        updatedStage({
            signature: useSign.data,
            sign_address: address,
            obj: JSON.stringify(stageDetail),
            order_id: order.order_id,
            stages: JSON.stringify(stages),
            status: 10
        })
        .then(res => {
            console.log(res);
        })
    }

    // 同意阶段划分 
    const permitStage = () => {
        if (order.worker === address) {
            sendSignature()
            return
        }

        setIsLoading(true);
        let sum = 0;
        dataStages.map(e => {
            sum += e.amount;
        })
        if (sum > (task.budegt / Math.pow(10,18))) {
            confirm({
                title: '你确认支付这笔订单吗?',
                icon: <ExclamationCircleOutlined />,
                content: '当前总金额超出预期金额!',
                onOk() {
                  permit(sum);
                },
                onCancel() {},
              });
        }else{
            permit(sum)
        }
    }

    const permit = (sum) => {
        let r = '0x' + order.signature.substring(2).substring(0, 64);
        let s = '0x' + order.signature.substring(2).substring(64, 128);
        let v = '0x' + order.signature.substring(2).substring(128, 130);
        let value = ethers.utils.parseEther(`${sum}`);
        let _amount = [];
        let _period = [];
        let funcList = [];

        dataStages.map((e,i) => {
            _amount.push(ethers.utils.parseEther(`${e.amount}`));
            _period.push(`${e.period * 24 * 60 * 60}`);
        })
        funcList.push({
            functionName: 'permitStage',
            params: [order.order_id, _amount, _period, nonces.data, order.stages.deadline, v, r, s]
        })
        funcList.push({
            functionName: 'payOrder',
            params: [order.order_id, value]
        })
        if ((task.budegt / Math.pow(10,18)) !== sum) {
            funcList.push({
                functionName: 'modifyOrder',
                params: [order.order_id, ethers.constants.AddressZero, value]
            })
        }
        funcList.push({
            functionName: 'startOrder',
            params: [order.order_id]
        })
        console.log(funcList);
        multicallWrite(muticallEncode(funcList),address,value)
        .then(res => {
            // 发送后端请求 ==> 开始任务
            startOrder({
                order_id: order.order_id
            })
            .then(res => {
                if (res.code === 0) {
                    message.success('项目开始')
                    setTimeout(() => {
                        history.go(0)
                    }, 500);              
                }else{
                    setIsLoading(false);
                }
            })
        })
        .catch(err => {
            console.log(err);
            setIsLoading(false);
        })


    }

    // 总计各阶段
    const printStageTotal = () => {
        let arr = [];
        for (const i in inner) {
            if (inner[i].amount) {
                arr.push(inner[i]);
            }
        }
        return arr.map((e,i) => 
            <p key={i}>P{i+1} stage cost: <span>{e.amount}</span></p>
        )
        
    }

    // 总计金额
    const printTotal = () => {
        let sum = 0;
        for (const i in inner) {
            sum+=inner[i].amount;
        }
        return <p className="totalText">Total expenses: <span>{sum}</span></p>
    }

    // 总计周期
    const printTotalPeriod = () => {
        let sum = 0;
        for (const i in inner) {
            sum+=inner[i].period;
        }
        let now = new Date().getTime();
        let end = new Date().getTime() + (sum * 24 * 60 * 60 * 1000);
        let nowTime = getDate(now,'d');
        let endTime = getDate(end,'d');
        return <div className="poa">
            <p>Estimated time: {sum}Day</p>
            <p>Development cycle: {nowTime}~{endTime}</p>
        </div>
    }

    const switchSetStageCard = () => {

        switch (progressSet) {
            case 0:
                return <>
                    <p className="title">Waiting phase division</p>
                    <div className="img_p0 mb60">
                        <Image src='/img/img-order-p0.png' layout="fill" />
                    </div>
                </>
            case 1:
                return <>
                <p className="title">Task stage division</p>
                <div className="payModel">
                    <Checkbox checked={stage.orderModel} onChange={toggleModel}>
                        Increase advance payment
                    </Checkbox>
                    { 
                        stage.orderModel && 
                        <div className="prepay">
                            <InputNumber /><span>{order.currency}</span>
                        </div> 
                    }
                </div>
                <InnerStageCard defaultAmount={amount} getInner={getInner} />
                
                {
                    JSON.stringify(inner) !== '{}' && <>
                        {/* 总计 */}
                        <div className="total">
                            {
                                stage.orderModel && <p>Advance charge: <span>{}</span></p>
                            }
                            {printStageTotal()}
                            {printTotal()}
                            {printTotalPeriod()}
                        </div>
                        <Button className={`submit ${btnDisabled ? 'hidden' : 'show'}`} onClick={() => sendSignature()} disabled={btnDisabled}>Complete and submit phasing</Button>
                    </>
                }
            </>
            case 2:
                // 判断是自己设置的还是对方设置的
                if (order.issuer === address || order.worker === address) {     
                    if (order.sign_address === address) {       //  修改了这部分
                        // 是你的
                        return <>
                            <p className="title">Task stage division</p>
                            <div className="payModel">
                                <Checkbox checked={dataStages[0].period === 0 ? true : false} disabled>
                                    Increase advance payment
                                </Checkbox>
                                { 
                                    dataStages[0].period === 0 && 
                                    <div className="prepay">
                                        {dataStages[0].amount}
                                    </div> 
                                }
                            </div>
                            <InnerStageCard defaultAmount={amount} getInner={getInner} dataStages={dataStages} edit="none" />
                            {/* 总计 */}
                            <div className="total">
                                {
                                    dataStages[0].period === 0 && 
                                    <p>Advance charge: <span>{}</span></p>
                                }
                                {printStageTotal()}
                                {printTotal()}
                                {printTotalPeriod()}
                            </div>
                        </>
                    }else{
                        // 不是 你的
                        return <>
                            <p className="title">Task stage division</p>
                            <div className="payModel">
                                <Checkbox checked={dataStages[0].period === 0 ? true : false}>
                                    Increase advance payment
                                </Checkbox>
                                { 
                                    dataStages[0].period === 0 && 
                                    <div className="prepay">
                                        {dataStages[0].amount}
                                    </div> 
                                }
                            </div>
                            <InnerStageCard defaultAmount={amount} getInner={getInner} dataStages={dataStages} edit="block" setIsChange={setIsChange} />
                            <div className="total">
                                {
                                    dataStages[0].period === 0 && 
                                    <p>Advance charge: <span>{}</span></p>
                                }
                                {printStageTotal()}
                                {printTotal()}
                                {printTotalPeriod()}
                            </div>
                            {
                                !isChange ? 
                                <Button 
                                    className="submit show"
                                    onClick={() => permitStage()} 
                                    loading={isLoading}
                                 >Agree</Button>
                                :
                                <Button 
                                    className={`submit ${btnDisabled ? 'hidden' : 'show'}`} 
                                    onClick={() => sendSignature()} 
                                    disabled={btnDisabled}
                                 >修改阶段划分</Button> 
                            }
                        </>
                    }
                }else{
                    return <h1>非该项目参与者</h1>
                }
            default:
                break;
        }
    }

    useEffect(() => {
        // 判断是否设置过
        if (!order.signature) {
            progressSet = search.who === 'issuer' ? 0 : 1;  //  设置阶段初始化: 0:甲方的初始化 1:乙方的初始化
        }else {
            progressSet = 2;    //  2:已经有一方设置了阶段 => 双方显示一样的
        }
        setProgressSet(progressSet);
    },[])

    // 发起签名
    useEffect(() => {
        if (obj.chainId && isSigner) {
            useSign.signTypedData();
        }
    },[signObj])

    // 签名成功返回
    useEffect(() => {
        useSign.data && signObj && signSuccess()
    },[useSign.data])

    return  (
        <>
            <div className="stageCard">
                { switchSetStageCard() }
            </div>
        </>
    )
}