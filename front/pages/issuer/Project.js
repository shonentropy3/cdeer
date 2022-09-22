import Panel_stageInfo from "../../components/Panel_stageInfo";
import { Steps, Button, message } from "antd";
import { useEffect, useState } from "react";
import { multicallWrite, testContract, useContracts, useReads, useSignData, useStageReads } from "../../controller";
import { ethers } from "ethers";
import { getOrdersInfo, getStagesHash, getStagesJson } from "../../http/api";
import { useAccount, useNetwork, useProvider } from 'wagmi'
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function Project() {
    const provider = useProvider()

    const { chain } = useNetwork();
    const { address } = useAccount();
    const { Step } = Steps;
    const [stages,setStages] = useState([]);
    const [advance,setAdvance] = useState(0);
    let [oid,setOid] = useState(null);
    let [task,setTask] = useState(null);
    let [amount,setAmount] = useState();
    let [total,setTotal] = useState(0);
    let [totalPeriod,setTotalPeriod] = useState(0);
    let [testObj,setTestObj] = useState({});
    let [signHash,setSignHash] = useState();
    let [nonce,setNonce] = useState(null);
    let [multicall,setMulticall] = useState([]);
    let [deadLine,setDeadLine] = useState('');
    let [signature,setSignature] = useState('');
    let [btnStatus,setBtnStatus] = useState(true);      //  true: permit || false: setStage
    let [steps,setSteps] = useState(0);

    const { useOrderReads: Order } = useReads('getOrder',[oid]);
    const { useOrderReads: nonces } = useReads('nonces',[address]);
    const { useSign, params, obj } = useSignData(testObj);
    const { useOrderContractWrite: OrderWirte } = useContracts('startOrder');
    
    const readSuccess = () => {
        amount = Order.data[0].amount.toString() / Math.pow(10,18);
        if (Order.data[0].progress == 4) {
            steps = 3;
        }else if(Order.data[0].progress == 7){
            steps = 4;
        }else{
            steps = 2;
        }
        setSteps(steps);
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

    const permit = () => {
                
        let _amounts = [ethers.utils.parseEther(`${advance}`)];
        let _periods = ['0'];
        stages.map(e => {
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
            params: [oid, _amounts, _periods, nonce, deadLine, v, r, s]
        })
        arr.push({
            functionName: 'payOrder',
            params: [oid, value]
        })
        if (amount !== total) {
            arr.push({
                functionName: 'modifyOrder',
                params: [oid, ethers.constants.AddressZero, value]
            })
        }
        arr.push({
            functionName: 'startOrder',
            params: [oid]
        })
        
        multicall = arr;
        setMulticall([...multicall]);
        let params = testContract(multicall);
        console.log(params);
        multicallWrite(params,address,value)
        .then(res => {
            console.log('success ==>',res);
            message.success('项目开始')
            setTimeout(() => {
                history.go(0)
            }, 500);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const setStage = async() => {
        // 设置阶段
        let now = parseInt(new Date().getTime()/1000);
        let setTime = 2 * 24 * 60 * 60;
        deadLine = now+setTime;
        setDeadLine(deadLine);
        let _amounts = [ethers.utils.parseEther(`${advance}`)];
        let _periods = ['0'];
        stages.map(e => {
            _amounts.push(ethers.utils.parseEther(`${e.budget}`));
            _periods.push(`${e.period * 24 * 60 * 60}`)
        })
        testObj = {
            amounts: _amounts,
            periods: _periods,
            chainId: chain.id,
            address: address,
            oid: oid,
            nonce: nonce,
            deadline: `${now+setTime}`
        }
        setTestObj({...testObj})
    }

    const writeSuccess = () => {
        let stageDetail = {
            orderId: oid,
            stages: [],
            task: {
                id: task.tid,
                title: task.data.title,
                desc: task.data.desc,
                attachment: task.data.attachment,
            },
            last: task.stagejson, //  jsonhash
            version: '1.0'
        };
        stages.map(e => {
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
        stages.map(e => {
            a.push(e.budget);
            b.push(e.period)
        })
        let info = {
            signature: signHash,
            signaddress: address
        }
        let order_Stages = {
            amount: a,
            period: b,
            deadline: deadLine
        }
        getStagesHash({obj: JSON.stringify(stageDetail), oid: oid, info: info, stages: JSON.stringify(order_Stages)})
        .then(res => {
              // ipfs ==> 存入链上 && 存入stageDetail.last
              if (res.code === 200) {
                message.success('划分阶段成功')
                setTimeout(() => {
                    history.go(-1);
                }, 500);
              }else{
                message.error('划分阶段失败')
              }
        })
        return
        
    }

    const getTaskInfo = () => {
        getOrdersInfo(oid)
        .then(res => {
            task = res[0];
            setTask({...task})
        })
    }

    const sendSign = () => {
        useSign.signTypedData()
    }

    const signSuccess = () => {
        signHash = useSign.data;
        setSignHash(signHash);

        writeSuccess()
    }

    const getNonces = () => {
        nonce = nonces.data.toString();
        setNonce(nonce);
    }

    useEffect(() => {
        OrderWirte.isSuccess ?
            console.log(OrderWirte.data)
            :
            ''
            // console.log(OrderWirte.error);
    },[OrderWirte.isSuccess])

    useEffect(() => {
        nonces.data ? 
            getNonces()
            :
            ''
    },[nonces.data])

    useEffect(() => {
        useSign.data ? 
            signSuccess()
            :
            ''
    },[useSign.data])

    useEffect(() => {
        obj.chainId ? 
            sendSign()
            :
            ''
    },[params])

    useEffect(() => {
        oid = location.search.slice('?')[1];
        setOid(Number(oid));
        getStagesJson({oid: oid})
        .then(res => {
            deadLine = res.stages.deadline;
            setDeadLine(deadLine);
            signature = res.signature;
            setSignature(signature);
            let arr = [];
            if (res.stages) {
                res.json.stages.map((e,i) => {
                    arr.push({
                        budget: res.stages.amount[i],
                        period: res.stages.period[i],
                        content: e.milestone.content,
                        percent: '',
                        stageIndex: i+1,
                        title: e.milestone.title
                    })
                })
                setStages([...arr]);
            }
        })
        
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

    useEffect(() => {
        oid !== null ? 
            getTaskInfo()
            :
            ''
    },[oid])
    
    return <div className="WorkerProject">
        <div className="worker-title">
            <h1>{amount}</h1>
        </div>
        <div className="worker-steps">
            <Steps size="small" current={steps}>
                <Step title="发布" />
                <Step title="报名中" />
                <Step title="阶段划分" />
                <Step title="开发中" />
                <Step title="完成" />
            </Steps>
        </div>
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
        <div className="worker-signInStage">
            <Panel_stageInfo getStages={setStages} Stages={stages} getAdvance={setAdvance} amount={amount} OrderInfo={Order} Oid={oid}/>
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
        {
            btnStatus ? 
                <>
                    <p className="tips"><ExclamationCircleOutlined style={{color: 'red', marginRight: '10px'}} />同意后,项目正式启动.并按照阶段划分作为项目交付计划和付款计划</p>
                    <Button type='primary' className='worker-btn' onClick={() => permit()}>同意阶段划分</Button>
                </>
                :
                <Button type='primary' className='worker-btn' onClick={() => setStage()}>完成并提交阶段划分</Button>
        }

        <div className="h50"></div>
    </div>
}