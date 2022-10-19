import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { Steps, Button, message, Modal, Image } from "antd";
import { getDemandInfo } from "../http/api/task";
import { multicallWrite, muticallEncode, useRead, useSignData } from "../controller";
import Stage_info from "../components/Stage_info";
import { ethers } from "ethers";
import { useAccount, useNetwork } from 'wagmi'
import { getOrdersInfo, getStagesHash, getStagesJson } from "../http/api/order";
import { getDate } from "../utils/getDate";
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { deform_Skills } from '../utils/Deform';

export default function Order(props) {
    
    let [query,setQuery] = useState({});
    let [task,setTask] = useState({});
    let [price,setPrice] = useState({});
    let [signObj,setSignObj] = useState({});
    let [step,setStep] = useState();
    let [stagesData,setStagesData] = useState();
    let [modifyStatus,setModifyStatus] = useState(false);
    let [deadLine,setDeadLine] = useState();
    let [nonce,setNonce] = useState();
    let [isSigner,setIsSigner] = useState(false);
    let [stagejson,setStagejson] = useState('');
    let [Json,setJson] = useState({});
    let [signaddress,setSignaddress] = useState();
    let [permitNonce,setPermitNonce] = useState();
    // 确认划分
    let [signature,setSignature] = useState('');
    // json
    const [attachment, setAttachment] = useState({});

    let [taskID,setTaskID] = useState('');
    let [project,setProject] = useState({});

    // 账号身份
    let [identity,setIdentity] = useState()

    // 技能要求列表
    let [skills,setSkills] = useState({
        "101":"solidity",
        "102":"javascript",
        "103":"python",
        "104":"Go",
        "105":"C/C++",
        "106":"Android",
        "107":"HTML/CSS",
        "108":"IOS"
    });

    // 擅长技能假数据
    const [goodSkills,setGoodSkills] = useState([
        "javascripts",
        "solidity"
    ])

    const { confirm } = Modal;
    const { Step } = Steps;
    const router = useRouter();
    const { chain } = useNetwork();
    const { address } = useAccount();
    const { useTaskRead } = useRead('tasks', query.tid);
    const { useOrderRead: Order } = useRead('getOrder', query.oid);
    const { useStageRead: stagesChain } = useRead('getStages', query.oid);
    const { useOrderRead: nonces } = useRead('nonces', address);
    const { useSign, obj } = useSignData(signObj);
    
    // 获取链上数据
    const readContract = async() => {
        console.log(useTaskRead.data);
        if (query.tid && useTaskRead.data && Order.data) {
            let multiple = useTaskRead.data.currency === 1 ? Math.pow(10,18) : 1;
            // 价格从Order获取不从Task获取
            price.budget = Order.data.amount.toString() / multiple;
            price.currency = useTaskRead.data.currency;
            setPrice({...price});
        }
        if (query.oid && stagesChain.data) {   
            // TODO: chain阶段详情
            await getStages()
            .then(() => {
                if (stagesChain.data.length !== stagesData.length) {
                    stagesData[stagesData.length-1].append = true;
                    stagesData[stagesData.length-1].appendAddress = signaddress;
                }
                stagesChain.data.map((e,i) => {
                    let period = e.period.toString() / 60 / 60 / 24;
                    let budget = e.amount.toString() / Math.pow(10,18);
                    // 对比数据库数据与链上数据
                    if (stagesData[i].period != period) {
                        stagesData[i].prolongStage = stagesData[i].period;
                        stagesData[i].prolongAddress = signaddress;
                    }
                    stagesData[i].period = period;
                    stagesData[i].budget = budget;
                    stagesData[i].status = e.status;
                })
                setStagesData([...stagesData]);
            })
            
        }
    }

    // 获取任务详情
    const getProject = async() => {
        await getDemandInfo({id: taskID})
        .then(res=>{
            let obj = res.data[0]
            obj.role = deform_Skills(obj.role);
            project = obj
            setProject({...project});
        })
        .catch(err=>{
            console.log(err);
        })
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

    const overflow = () => {
        let total = 0;
        stagesData.map(e => {
            total += e.budget;
        })
        if (total !== (task.budget / Math.pow(10,18))) {
            showConfirm()
        }else{
            permit()
        }
    }

    const permit = () => {
        let _amounts = [];
        let _periods = [];
        let total = 0;
        stagesData.map(e => {
            total += e.budget;
            _amounts.push(ethers.utils.parseEther(`${e.budget}`));
            _periods.push(`${e.period * 24 * 60 * 60}`);
        })

        let r = '0x' + signature.substring(2).substring(0, 64);
        let s = '0x' + signature.substring(2).substring(64, 128);
        let v = '0x' + signature.substring(2).substring(128, 130);

        let value = ethers.utils.parseEther(`${total}`);
        let arr = [];
        arr.push({
            functionName: 'permitStage',
            params: [query.oid, _amounts, _periods, nonce, deadLine, v, r, s]
        })
        arr.push({
            functionName: 'payOrder',
            params: [query.oid, value]
        })
        if (task.budget !== total) {
            arr.push({
                functionName: 'modifyOrder',
                params: [query.oid, ethers.constants.AddressZero, value]
            })
        }
        arr.push({
            functionName: 'startOrder',
            params: [query.oid]
        })
        

        let params = muticallEncode(arr);
        multicallWrite(params,address,value)
        .then(res => {
            message.success('项目开始')
            setTimeout(() => {
                // history.go(0)
            }, 500);
        })
        .catch(err => {
            console.log(err);
        })
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

    const getStages = async() => {
        await getStagesJson({oid: query.oid})
            .then(res => {
                // TODO: 判断是否有人设置阶段
                if (res.json) {
                    attachment = res.json;
                    attachment.last = res.attachment;
                    setAttachment({...attachment});
                }
                if (res.signature) {
                    permitNonce = res.signnonce;
                    setPermitNonce(permitNonce);
                    signature = res.signature;
                    setSignature(signature);
                    deadLine = res.stages.deadline;
                    setDeadLine(deadLine);
                    let arr = [];
                    if (res.signaddress) {
                        signaddress = res.signaddress;
                        setSignaddress(signaddress);
                    }
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

    const showConfirm = () => {
        confirm({
          title: '你确认支付这笔订单吗?',
          icon: <ExclamationCircleOutlined />,
          content: '当前总金额超出预期金额!',
          onOk() {
            permit();
          },
          onCancel() {},
        });
      };

    // const total = () => {
    //     if (!stagesData) {
    //         return
    //     }
    //     let allPeriod = 0;
    //     let allTotal = 0;
    //     let now = new Date().getTime();
    //     return <>
    //             {
    //                 stagesData.map((e,i) => {
    //                     allPeriod += e.period;
    //                     allTotal += e.budget;
    //                     if (e.period === 0) {
    //                         return <p key={i}>预付款: <span>{stagesData[0].budget}</span>ETH</p>
    //                     }else{
    //                         let p = stagesData[0].period === 0 ? i : i+1;
    //                         return <p key={i}>P{p}阶段费用: <span>{e.budget}</span>ETH </p>
    //                     }})
    //             }
    //             <p>开发周期: <span>{allPeriod}</span>DAYS</p>
    //             <p>预计时间: <span>{getDate(now,'d')} / {getDate(now + (allPeriod * 24 * 60 * 60 * 1000),'d')}</span></p>
    //             <strong>总费用: {allTotal}ETH</strong>
    //     </>
    // }

    const btn = () => {
        if (step === 0) {
            return (
                query.who === 'issuer' && !modifyStatus ? <>
                    <p className="tips"><ExclamationCircleOutlined style={{color: 'red', marginRight: '10px'}} />同意后,项目正式启动.并按照阶段划分作为项目交付计划和付款计划</p>
                    <Button type='primary' className='worker-btn' onClick={() => overflow()}>同意阶段划分</Button></>
                    :
                    <Button type='primary' className='worker-btn' onClick={() => setStage()}>完成并提交阶段划分</Button>
            )
        }
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
        }
    },[step])

    useEffect(() => {
        if (query.oid && Order.data) {
            readContract()
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
    },[Order.data])

    useEffect(() => {
        taskID = location.search.split('=')[3];
        identity = location.search.split('=')[2].split('&')[0]
        setTaskID(taskID);
        setIdentity(identity);
        getProject()
    },[])

    useEffect(()=>{
        console.log(Order);
        console.log("====",query);
    },[])

    return <div className="WorkerProject">
                <div className="worker-title">
                    {/* <h1>{amount}</h1> */}
                    {/* TODO: 获取task */}
                    <div className="title-info">
                        <strong className="title-info-head">{task.title}</strong>
                        <p className="title-info-role">Recruitment type: {
                            task.role?.map((e,i)=>(
                                <span className="title-info-role-li" key={i}>{e?skills[e]:""}</span>
                            ))
                        }</p>
                        <div>
                            <p className="title-info-cycle">cycle: <span className="title-info-cycle-date">{task.period / 24 / 60 / 60}天</span> </p>
                        </div>
                    </div>
                    <div className="title-cost">
                        <p className="title-cost-line">cost: <span className="title-cost-price">{price.budget}{price.currency === 1 ? 'ETH' : 'BTC'}</span> </p>
                    </div>
                </div>
                <div className="worker-steps">
                    <Steps size="small" current={step}>
                        <Step title="Start" />
                        <Step className="steps-stage" title="Stage plan" />
                        <Step title="Perform tasks" />
                        <Step className="steps-finish" title="Finish" />
                    </Steps>
                </div>
                {
                    identity == "worker" ? <div className="order-tip">
                    <p className="order-tip-text">The demander has approved your application, please complete the phase division</p>
                </div> : ""
                }
                {
                    query.who === 'issuer' ? 
                        <div className="issuer-workerInfo">
                            <div className="workerInfo-title">Task stage division：</div>
                            <div className="workerInfo-content">
                                <div className="img"></div>
                                <div className="info">
                                    <p className="title">Tony<span>View personal information</span></p>
                                    <p className="subtitle">Good at skills： 
                                        {
                                            goodSkills.map((e,i) => (
                                                <span key={i}>{e}</span>
                                            ))
                                        }
                                    </p>
                                    <div className="boxs">
                                        <div className="box">
                                            <div className="icon">
                                                <Image src="/telegram.png" />
                                            </div>
                                        </div>
                                        <div className="box">
                                            <div className="icon">
                                                <Image src="/skype.png" />
                                            </div>
                                        </div>
                                        <div className="box">
                                            <div className="icon">
                                                <Image src="/wechat.png" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> : ''
                }
                    <Stage_info 
                        Query={query} 
                        Amount={task.budget} 
                        OrderInfo={Order} Step={step} 
                        StagesData={setStagesData} 
                        Data={stagesData} 
                        isModify={setModifyStatus} 
                        Attachment={attachment} 
                        permitNonce={permitNonce}
                        isSignObj={setSignObj}
                        ModifyStatus = {modifyStatus}
                    />
                <div className="worker-signInStage">
                </div>
                {/* <div className="worker-total">{total()}</div> */}
                {btn()}
                <div className="content-container">
            <p className='task-details'>Task Details</p>
            <div className='task-detail-list'>
                <p className='task-type task-li'>
                    <span className='task-type-title title'>Type：</span>
                    <span className='task-type-text content'>Blockchain</span>
                </p>
                <p className='task-cost task-li'>
                    <span className='task-cost-title title'>Cost：</span>
                    <span className='task-cost-price content'>{project.budget / 1000000000000000000}ETH</span>
                </p>
                <p className='task-date task-li'>
                    <span className='task-date-title title'>Cycle：</span>
                    <span className='task-date-time content'>{project.period / 86400}days</span>
                </p>
            </div>
            <div className="content-li">
                <p className="li-title">Task Description：</p>
                <div className="li-box">
                    <p className="detail content">
                        {project.desc}
                    </p>
                </div>
            </div>
            <div className="content-li">
                <p className="li-title">Task document：</p>
                <div className="li-box">
                    <div className="upload">
                        <p className="upload-title">{project.suffix}</p>
                        {/* <p>下载</p> */}
                    </div>
                </div>
            </div>
            <div className="content-li">
                <p className="li-title">Skill requirements：</p>
                <div className="li-box boxs">
                {
                        project.role ? 
                        project.role.map((e,i) => <div className="box" key={i}>{e}</div> )
                        :
                        ''
                    }
                </div>
            </div>

        </div>
                <div className="h50"></div>
            </div>
}