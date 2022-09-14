import Panel_stageInfo from "../../components/Panel_stageInfo";
import { Steps, Button, message } from "antd";
import { useEffect, useState } from "react";
import { useContracts, useReads } from "../../controller";
import { ethers } from "ethers";

export default function Project(params) {

    const { useOrderContractWrite: DeOrder, orderConfig } = useContracts('setStage')
    const { Step } = Steps;
    const [stages,setStages] = useState([]);
    const [advance,setAdvance] = useState(0);
    let [oid,setOid] = useState();
    let [amount,setAmount] = useState();
    let [total,setTotal] = useState(0);
    let [totalPeriod,setTotalPeriod] = useState(0);

    const { useOrderReads: Order } = useReads('getOrder',[oid]);

    const readSuccess = () => {
        amount = Order.data[0].amount.toString();
        setAmount(amount);
    }

    const count = () => {
        total = 0;
        totalPeriod = 0;
        total += advance;
        stages.map(e => {
            total += e.budget;
            totalPeriod += e.period;
            setTotalPeriod(totalPeriod);
            setTotal(total);
        })
    }

    const setStage = () => {
        // 设置阶段
        let _amounts = [];
        let _periods = [];
        stages.map(e => {
            _amounts.push(ethers.utils.parseEther(`${e.budget}`));
            _periods.push(e.period * 24 * 60 * 60)
        })
        DeOrder.write({
            recklesslySetUnpreparedArgs: [
                oid,
                _amounts,
                _periods
            ]
        })
    }

    const writeSuccess = () => {
        message.success('划分阶段成功')
        setTimeout(() => {
            history.go(-1);
        }, 500);
    }

    useEffect(() => {
        DeOrder.isSuccess ? 
            writeSuccess()
            :
            ''
    },[DeOrder.isSuccess])

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

    useEffect(() => {
        stages.length !== 0 ?
            count()
            :
            ''
    },[stages,advance])
    
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
            <Panel_stageInfo getStages={setStages} getAdvance={setAdvance} amount={amount}/>
        </div>
        <div className="worker-total">
            {
                advance !== 0 ? 
                    <p>预付款: <span>{advance}</span>ETH</p>
                    :
                    ''
            }
            {
                stages.map((e,i) => 
                    <p key={i}>P{i+1}阶段费用: <span>{e.budget}</span>ETH </p>
                )
            }
            <p>开发周期: <span>{totalPeriod}</span>DAYS</p>
            <strong>总费用: {total}ETH</strong>
        </div>
        <Button type='primary' className='worker-btn' onClick={() => setStage()}>完成并提交阶段划分</Button>
        <div className="h50"></div>
    </div>
}