import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { Steps, Button, message } from "antd";
import { getDemandInfo } from "../http/api/task";
import { useRead, useSignData } from "../controller";
import Stage_info from "../components/Stage_info";
import { ethers } from "ethers";
import { useAccount, useNetwork } from 'wagmi'
import { getOrdersInfo, getStagesHash, getStagesJson } from "../http/api/order";

export default function order(props) {
    
    let [query,setQuery] = useState({});
    let [task,setTask] = useState({});
    let [signObj,setSignObj] = useState({});
    let [step,setStep] = useState();
    let [stagesData,setStagesData] = useState();
    let [deadLine,setDeadLine] = useState();
    let [nonce,setNonce] = useState();
    let [isSigner,setIsSigner] = useState(false);
    let [stagejson,setStagejson] = useState('');
    
    const { Step } = Steps;
    const router = useRouter();
    const { chain } = useNetwork();
    const { address } = useAccount();
    const { useTaskRead } = useRead('tasks', query.tid);
    const { useStageRead } = useRead('ongoingStage', query.oid);
    const { useOrderRead: Order } = useRead('getOrder', query.oid);
    const { useStageRead: StagesChain } = useRead('getStages', query.oid);
    const { useOrderRead: nonces } = useRead('nonces', address);
    const { useSign, obj } = useSignData(signObj);
    
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

        if (nonces.data) {
            nonce = nonces.data.toString();
            setNonce(nonce)
        }
    }

    const setStage = () => {
        // 设置阶段
            let now = parseInt(new Date().getTime()/1000);
            let setTime = 2 * 24 * 60 * 60;
            deadLine = now+setTime;
            setDeadLine(deadLine);
            let _amounts = [];
            let _periods = [];
            stagesData.map(e => {
                _amounts.push(ethers.utils.parseEther(`${e.budget}`));
                _periods.push(`${e.period * 24 * 60 * 60}`)
            })
            signObj = {
                amounts: _amounts,
                periods: _periods,
                chainId: chain.id,
                address: address,
                oid: query.oid,
                nonce: nonce,
                deadline: `${now+setTime}`
            }
            setSignObj({...signObj});
            setIsSigner(true);
    }

    const signSuccess = () => {
        setIsSigner(false);
        let stageDetail = {
            orderId: query.oid,
            stages: [],
            task: {
                id: query.tid,
                title: task.title,
                desc: task.desc,
                attachment: task.attachment,
            },
            last: stagejson, //  jsonhash
            version: '1.0'
        };
        stagesData.map(e => {
            stageDetail.stages.push({
                milestone: {
                    type: 'raw',
                    content: e.content,
                    title: e.title
                },
                delivery: {
                    attachment: '',
                    fileType: '',
                    content: ''
                }
            })
        })
        let a = [];
        let b = [];
        stagesData.map(e => {
            a.push(e.budget);
            b.push(e.period)
        })
        let info = {
            signature: useSign.data,
            signaddress: address
        }
        let order_Stages = {
            amount: a,
            period: b,
            deadline: deadLine
        }
        getStagesHash({
            obj: JSON.stringify(stageDetail),
            oid: query.oid, 
            info: info,
            stages: JSON.stringify(order_Stages)
        })
        .then(res => {
              // ipfs ==> 存入链上 && 存入stageDetail.last
              if (res.code === 200) {
                message.success('划分阶段成功')
                setTimeout(() => {
                    history.go(0);
                }, 500);
              }else{
                message.error('划分阶段失败')
              }
        })
    }

    useEffect(() => {
        init()
    },[router])

    useEffect(() => {
        if (obj.chainId && isSigner) {
            useSign.signTypedData();
        }
    },[signObj])

    useEffect(() => {
        useSign.data ? signSuccess() : ''
    },[useSign.data])

    useEffect(() => {
        if (step === 0) {
            // 获取stagejson
            getOrdersInfo(query.oid)
            .then(res => {
                stagejson = res[0].stagejson;
                setStagejson(stagejson);
            })

            getStagesJson({oid: query.oid})
            .then(res => {
                // TODO: 判断是否有人设置阶段
                if (res.signature) {
                   let arr = [];
                    if (res.stages) {
                        res.json.stages.map((e,i) => {
                            arr.push({
                                budget: res.stages.amount[i],
                                period: res.stages.period[i],
                                content: e.milestone.content,
                                percent: '',
                                title: e.milestone.title
                            })
                        })
                        stagesData = arr;
                        setStagesData([...arr]);
                    } 
                }
                
            })
        }
    },[step])

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
                    <Stage_info Query={query} Amount={task.budget} OrderInfo={Order} Step={step} StagesData={setStagesData} Data={stagesData} />
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