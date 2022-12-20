import { useSetState } from "ahooks";
import { Button, Checkbox, InputNumber, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import OutputStageCard from "../CustomCard/outputStageCard";



export default function OrderStageList(params) {
    
    const { order, dataStages } = params;
    const { address } = useAccount();
    let [data, setData] = useState([]);



    // 添加阶段
    const appendStage = () => {
        
    }

    useEffect(() => {
        let deliveryDate = 0;
        dataStages.map((e,i) => {
            deliveryDate += e.period;
            e.deliveryDate = deliveryDate;
        })
        data = dataStages;
        setData([...data]);
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
                <OutputStageCard isEdit="none" data={data} />
                <Button className="btn-add mb60" onClick={() => appendStage()}>Establish</Button>
            </div>
        </div>
    )
}