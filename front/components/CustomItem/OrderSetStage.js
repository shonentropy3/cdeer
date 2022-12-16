import { useSetState } from "ahooks";
import { Button, Checkbox, InputNumber } from "antd";
import { ethers } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react"
import { useAccount, useNetwork } from "wagmi";
import { useRead, useSignData } from "../../controller";
import InnerStageCard from "../CustomCard/innerStageCard";

export default function OrderSetStage(params) {
    
    const { search, order, amount } = params;
    let [progressSet, setProgressSet] = useState();
    let [stage, setStage] = useSetState({
        orderModel: false,      //  预付款模式
    });
    let [stages, setStages] = useState({
        amount: [], period: [], deadline: ''
    })
    let [inner, setInner] = useState();
    const { chain } = useNetwork();
    const { address } = useAccount();

    // 链上数据
    const { useOrderRead: nonces } = useRead('nonces', address);

    // 签名部分
    let [signObj,setSignObj] = useState({});    //  签名信息
    const { useSign, obj } = useSignData(signObj);
    let [isSigner,setIsSigner] = useState(false);


    //  切换order模式 ==> 预付款
    const toggleModel = (e) => {
        setStage({orderModel: e.target.checked})
    }

    //  获取阶段划分
    const getInner = (obj) => {
        inner = obj;
        setInner({...inner});
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
        setIsSigner(false)
        
    }

    const switchSetStageCard = () => {
        progressSet = 1;
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
                    {/* 总计 */}

                    {/* 按钮 */}
                    <Button onClick={sendSignature}>Complete and submit phasing</Button>
                </>
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