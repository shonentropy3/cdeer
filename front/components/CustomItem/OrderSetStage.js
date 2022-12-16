import { useSetState } from "ahooks";
import { Checkbox, InputNumber } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react"
import InnerStageCard from "../CustomCard/innerStageCard";

export default function OrderSetStage(params) {
    
    const { search, order } = params;
    let [progressSet, setProgressSet] = useState();
    let [stage, setStage] = useSetState({
        orderModel: false,      //  预付款模式
    });
    
    //  切换order模式 ==> 预付款
    const toggleModel = (e) => {
        setStage({orderModel: e.target.checked})
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
                            <>
                                <InputNumber /><span>{order.currency}</span>
                            </> 
                        }
                        <InnerStageCard />
                    </div>
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

    return  (
        <>
            <div className="stageCard">
                {
                    switchSetStageCard()
                }
            </div>
        </>
    )
}