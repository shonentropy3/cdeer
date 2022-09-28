import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { Steps, Button, message } from "antd";
import { getDemandInfo } from "../http/api/task";
import { useRead } from "../controller";
import Panel_stageInfo from "../components/Panel_stageInfo";
import Stage_info from "../components/Stage_info";


export default function order(props) {
    
    let [query,setQuery] = useState({});
    let [task,setTask] = useState({});
    let [step,setStep] = useState();
    const router = useRouter();
    const { Step } = Steps;
    const { useTaskRead } = useRead('tasks', query.tid);
    const { useStageRead } = useRead('ongoingStage', query.oid);
    const { useOrderRead: Order } = useRead('getOrder', query.oid);
    const { useStageRead: Stages } = useRead('getStages',query.oid);
    
    const readContract = () => {
        if (query.tid && useTaskRead.data) {
            let multiple = useTaskRead.data.currency === 1 ? Math.pow(10,18) : 1;
            task.budget = useTaskRead.data.budget.toString() / multiple;
            task.currency = useTaskRead.data.currency;
            setTask({...task});
        }
        if (query.oid && useStageRead.data) {
            // TODO: chain阶段详情 
            console.log(useStageRead.data);
        }
        if (query.oid && Order.data) {
            switch (Order.data.progress) {
                case 0:
                    step = 0;
                    break;
                case 4:
                    step = 1;
                    break;
                default:
                    step = 2;
                    break;
            }
            setStep(step);
        }
    }

    const init = () => {
        let url = location.search.split('?')[1];
        url = url.split('&');
        url.map(e => {
            query[e.split('=')[0]] = e.split('=')[1];
        })
        setQuery({...query});

        getDemandInfo({id: query.tid})
        .then(res => {
            if (res.code === 200 && res.data.length === 1) {
                task = res.data[0];
                task.budget
                setTask({...task});
                readContract()
            }
        })
    }

    useEffect(() => {
        init()
    },[router])

    return <div className="WorkerProject">
                <div className="worker-title">
                    {/* <h1>{amount}</h1> */}
                    {/* TODO: 获取task */}
                    <div className="title-info">
                        <strong>{task.title}</strong>
                        <p>技术要求: {task.role}</p>
                        <div>
                            <p>项目周期: <span>{task.period / 24 / 60 / 60}天</span> </p>
                            <p>项目预算: <span>{task.budget} {task.currency === 1 ? 'ETH' : 'BTC'}</span> </p>
                        </div>
                    </div>
                    <div className="title-num">
                        报名人数
                    </div>
                </div>
                <div className="worker-steps">
                    <Steps size="small" current={step}>
                        <Step title="阶段划分" />
                        <Step title="开发中" />
                        <Step title="已完成" />
                    </Steps>
                </div>
                {
                    query.who === 'issuer' ? 
                        <div className="issuer-workerInfo">
                            <div className="workerInfo-title">接单者信息</div>
                            <div className="workerInfo-content">
                                <div className="img"></div>
                                <div className="info">
                                    <p className="title">托尼</p>
                                    <p className="subtitle">他的技能: Solidity、Java、Go</p>
                                    <p className="detail">查看他的NFT</p>
                                    <div className="boxs">
                                        <div className="box">
                                            <div className="icon"></div>
                                            <p>Tonny Hool</p>
                                        </div>
                                        <div className="box">
                                            <div className="icon"></div>
                                            <p>Tonny Hool</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        ''
                }
                <div className="worker-signInStage">
                    <Stage_info Query={query} Amount={task.budget} OrderInfo={Order} Step={step} />
                    {/* <Panel_stageInfo getStages={setStages} Stages={stages} getAdvance={setAdvance} amount={amount} OrderInfo={Order} who={'worker'} Oid={oid} /> */}
                </div>
                <div className="worker-total">
                    {/* {
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
                    <strong>总费用: {total}ETH</strong> */}
                </div>
                <Button type='primary' className='worker-btn' onClick={() => setStage()}>完成并提交阶段划分</Button>
                <div className="h50"></div>
            </div>
}