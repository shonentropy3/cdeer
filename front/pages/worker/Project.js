import Panel_stageInfo from "../../components/Panel_stageInfo";
import { Steps, Button } from "antd";
import { useEffect, useState } from "react";
import { useReads } from "../../controller";

export default function Project(params) {

    const { Step } = Steps;
    const [stages,setStages] = useState([]);
    const [advance,setAdvance] = useState();
    let [oid,setOid] = useState();
    let [amount,setAmount] = useState();

    const { useOrderReads: Order } = useReads('getOrder',[oid]);

    const readSuccess = () => {
        amount = Order.data[0].amount.toString();
        setAmount(amount);
    }

    useEffect(() => {
        oid = location.search.slice('?')[1];
        setOid(Number(oid));
    },[])

    useEffect(() => {
        Order.data[0] !== null ? 
            readSuccess()
            :
            ''
    },[Order]) 
    
    return <div className="WorkerProject">
        <div className="worker-title">
            <h1>{amount}</h1>
        </div>
        <div className="worker-steps">
            <Steps size="small" current={2}>
                <Step title="发布" />
                <Step title="报名中" />
                <Step title="阶段划分" />
                <Step title="开发中" />
                <Step title="完成" />
            </Steps>
        </div>
        <div className="worker-signInStage">
            <Panel_stageInfo getStages={setStages} getAdvance={setAdvance} amount={amount} />
        </div>
        <div className="worker-total">
            <p>预付款: <span>{advance}</span>ETH </p>
            {
                stages.map((e,i) => 
                    <p key={i}>P{i+1}阶段费用: <span>{e.budget}</span>ETH </p>
                )
            }
            <p>开发周期: <span>2022.08.20</span> </p>
            <strong>总费用: 11ETH</strong>
        </div>
        <Button type='primary' className='worker-btn'>完成并提交阶段划分</Button>
        <div className="h50"></div>
    </div>
}