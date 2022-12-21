import { useSetState } from "ahooks";
import { Button, Checkbox, InputNumber, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRead } from "../../controller";
import OutputStageCard from "../CustomCard/OutputStageCard";



export default function OrderStageList(params) {
    
    const { order, dataStages } = params;
    const { address } = useAccount();
    let [data, setData] = useState([]);
    let [chainData, setChainData] = useState([]);
    let [stageIndex, setStageIndex] = useState(0);

    const { useStageRead: chainStages } = useRead('getStages',order.order_id);
    const { useStageRead: chainOngoing } = useRead('ongoingStage',order.order_id);
    

    

    // 添加阶段
    const appendStage = () => {

    }

    useEffect(() => {
        if (chainStages.data && data.length === 0) {
            let deliveryDate = 0;
            dataStages.map((e,i) => {
                deliveryDate += e.period;
                e.deliveryDate = deliveryDate;
            })
            data = dataStages;
            setData([...data]);

            let arr = [];
            chainStages.data.map(e => {
                arr.push({
                    amount: e.amount.toString() / Math.pow(10,18),
                    period: e.period.toString() / (24 * 60 * 60),
                    status: e.status
                })
            })
            chainData = arr;
            setChainData([...chainData]);
        }
    },[chainStages.data])

    useEffect(() => {
        if (chainOngoing.data) {
            let going = chainOngoing.data;
            stageIndex = Number(going.stageIndex.toString());
            setStageIndex(stageIndex);
            console.log('ongoing ==> ',going);
        }
    },[chainOngoing.data])

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
                />
                <Button className="btn-add mb60" onClick={() => appendStage()}>Establish</Button>
            </div>
        </div>
    )
}