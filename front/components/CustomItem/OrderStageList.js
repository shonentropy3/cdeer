import { useSetState } from "ahooks";
import { Button, Checkbox, InputNumber, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import OutputStageCard from "../CustomCard/outputStageCard";



export default function OrderStageList(params) {
    
    const { chache, data, order } = params;
    const { address } = useAccount();

    // chache: 暂存的阶段划分  ==>  data: 数据库内已存的阶段划分


    useEffect(() => {
        console.log('order ==> ',order);
    },[])

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
                <OutputStageCard isEdit="none" />
                <Button className="btn-add mb60" onClick={() => toggleModel()}>Establish</Button>
            </div>
        </div>
    )
}