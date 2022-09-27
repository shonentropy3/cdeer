import { Checkbox, Button, Card, message } from 'antd';
import { useEffect, useState } from 'react';
import { InputNumber, Select } from 'antd';
import StageCard from './Stage_card';
import StageInspection from './Stage_inspection';
import { multicallWrite, muticallEncode, testContract, useContracts, useReads, useSignAppendData } from '../controller';
import { useAccount, useNetwork } from 'wagmi'
import { ethers } from 'ethers';
import { getProlongStage, getStagesJson, updateSignature } from '../http/api';


export default function Panel_stageInfo(props) {
    
    const { Oid } = props;
    const { who } = props;
    const { OrderInfo } = props;
    const { amount } = props;
    const { Stages } = props;
    const { getStages } = props;
    const { getAdvance } = props;
    const { Option } = Select;
    const { chain } = useNetwork()
    const { address } = useAccount()
    let [advance,setAdvance] = useState(false);    
    let [stageList,setStageList] = useState([]);
    let [stages,setStages] = useState([]);
    let [dataStages,setDataStages] = useState([]);
    let [editMode,setEditMode] = useState(false);
    let [illM,setIllM] = useState(0);
    let [deadline,setDeadline] = useState(0);
    let [nonce,setNonce] = useState();
    const [activeTabKey1, setActiveTabKey1] = useState('0');
    let [orderStart, setOrderStart] = useState(false);
    let [info,setInfo] = useState({});
    let [appendObj,setAppendObj] = useState({});
    const { useOrderContractWrite: getWithdraw } = useContracts('withdraw');
    const { useOrderContractWrite: useAppendStage } = useContracts('appendStage');
    const { useOrderContractWrite: payOrder } = useContracts('payOrder');
    
    const { useStageReads } = useReads('pendingWithdraw',[1])
    const { useStageReads: Order } = useReads('getOrder',[Oid])
    const { useOrderReads: nonces } = useReads('nonces',[address]);
    const { useStageReads: contractStages, stageConfig } = useReads('getStages',[Oid])
    const { useSign, obj: useSignParams } = useSignAppendData(appendObj)

    
    const selectAfter = (
        <Select
          defaultValue="ETH"
        >
          <Option value="ETH">ETH</Option>
          <Option value="BTC">BTC</Option>
        </Select>
    );
    
    const onTab1Change = (key) => {
        setActiveTabKey1(key);
    };

    const onChange = e => {
        advance = e.target.checked;
        setAdvance(advance);
        getAdvance(advance)
    }

    const addStage = () => {
        activeTabKey1 = stageList.length;
        setActiveTabKey1(`${activeTabKey1}`);
        let num = stageList.length + 1;
        stageList.push({
            key: stageList.length,
            tab: 'P'+num,
        });
        stages.push({
            stageIndex: num,
            title: '',
            budget: '',
            period: '',
            content: '',
            percent: ''
        })
        
        setStages([...stages]);
        setStageList([...stageList]);
    }

    const isOk = () => {
        editMode = true;
        setEditMode(editMode);
        getStages([...stages]);
    }
    
    const gowithdraw = () => {
        // let data = useStageReads.data[0];
        // let pending = data.pending.toString() / Math.pow(10,18)
        // let next = data.nextStage.toString()
        // console.log(Oid, address, '当前可领取==>',pending, '|| stage==>',next);
        console.log(contractStages.data[0]);
        getWithdraw.write({
            recklesslySetUnpreparedArgs: [
                Oid, address
            ]
        })
    }

    const withdrawSuccess = () => {
        console.log(getWithdraw.data);
        message.success('取款成功');
    }

    const deleteStage = index => {
        stageList.splice(index,1);
        setStageList([...stageList]);
        stageList.map((e,i) => {
            e.key = i;
            e.tab = i+1;
            e.tab = 'P'+e.tab;
        })
        activeTabKey1 = '0';
        setActiveTabKey1(activeTabKey1);
        stages.splice(index,1)
        getStages([...stages]);
    }

    const init = () => {
        if (OrderInfo.data[0].progress >= 4) {
            orderStart = true;
            setOrderStart(orderStart);
        }

        let arr = []
        Stages.map((e,i) => {
            let num = i+1
            arr.push({
                key: arr.length,
                tab: 'P'+num,
            });
        })
        stageList = arr;
        // stages = Stages;
        if (Stages[0].period === 0) {
            getAdvance(Stages[0].budget);
            illM = Stages[0].budget;
            setIllM(illM);
            advance = true;
            setAdvance(advance);
            Stages.splice(0,1);
            setStages([...Stages]);
        }
        setStageList([...stageList]);
        setStages([...Stages]);
        setEditMode(true);
    }

    const getInfo = () => {
        let data = OrderInfo.data[0];
        let stageAmount = 0;
        Stages.map(e => {
            stageAmount += e.budget;
        })
        let obj = {
            amount: data.amount.toString() / Math.pow(10,18),
            issuer: data.issuer,
            payed: data.payed.toString() / Math.pow(10,18),
            progress: data.progress,
            startDate: data.startDate.toString()
        }
        obj.advance = obj.payed - stageAmount
        info = obj;
        setInfo({...info});
    }

    const payStage = () => {
        // payOrder.write({
        //     recklesslySetUnpreparedArgs:[
        //         Oid, ethers.utils.parseEther(`${100}`)
        //     ]
        // })
        multicallWrite(muticallEncode([{
            functionName: 'payOrder',
            params: [Oid, ethers.utils.parseEther(`${100}`)]
        }]),address,ethers.utils.parseEther(`${100}`))
        .then(res => {
            console.log('success ==>',res);
        })
        
    }

    const appendStage = () => {
        // TODO: 添加阶段
        new Promise((resolve, reject) => {
            let now = parseInt(new Date().getTime()/1000);
            let setTime = 2 * 24 * 60 * 60;
            let period = 5 * 24 * 60 * 60;
            deadline = now+setTime;
            setDeadline(deadline);
            let amount = ethers.utils.parseEther(`${100}`);
            let obj = {
                chainId: chain.id,
                orderId: Oid,
                amount: amount,
                period: period,
                nonce: nonce,  
                deadline: `${deadline}`,
            }
            appendObj = obj;
            setAppendObj({...appendObj})
            setTimeout(() => {
                resolve();
            }, 50);
        })
        .then(res => {
            useSign.signTypedData()
            console.log(useSign.error);
            console.log(useSignParams);
        })
    }

    const agreeApeend = () => {
        // 获取数据库数据
        getProlongStage({oid: Oid})
        .then(res => {
            if (res.code === 200) {
                let data = res.data;
                // console.log(res.data);
                console.log(
                    Oid, 
                    data.stages.amount[data.stages.amount.length - 1],
                    (data.stages.period[data.stages.period.length - 1] * 24 * 60 * 60), 
                    String(nonce), 
                    data.stages.deadline,
                    '0x' + data.signature.substring(2).substring(128, 130),
                    '0x' + data.signature.substring(2).substring(0, 64),
                    '0x' + data.signature.substring(2).substring(64, 128)
                );
                useAppendStage.write({
                    recklesslySetUnpreparedArgs: [
                        Oid, 
                        ethers.utils.parseEther(`${data.stages.amount[data.stages.amount.length - 1]}`),
                        (data.stages.period[data.stages.period.length - 1] * 24 * 60 * 60), 
                        String(nonce), 
                        data.stages.deadline,
                        '0x' + data.signature.substring(2).substring(128, 130),
                        '0x' + data.signature.substring(2).substring(0, 64),
                        '0x' + data.signature.substring(2).substring(64, 128)
                    ]
                })
            }
        })
    }

    useEffect(() => {
        if (useAppendStage.isSuccess) {
            console.log(useAppendStage.data);
        }
    },[useAppendStage.isSuccess])

    useEffect(() => {
        if (useSign.data) {
            console.log(useSign.data,dataStages, nonce);
            dataStages.amount.push(100)
            dataStages.period.push(5)
            dataStages.deadline = deadline;
            setDataStages({...dataStages})
            updateSignature({signature: useSign.data, signaddress: address, stages: JSON.stringify(dataStages), oid: Oid, nonce: nonce})
            .then(res => {
                message.success('操作成功')
            })
        }
    },[useSign.data])

    useEffect(() => {
        if (nonces.data[0] && !nonce) {
            nonce = nonces.data[0].toString();
            console.log(nonce,'====>');
            setNonce(nonce);
        }
    },[nonces.data])

    useEffect(() => {
        getWithdraw.isSuccess ? 
            withdrawSuccess()
            :
            ''
    },[getWithdraw.isSuccess])

    useEffect(() => {
        getWithdraw.error ? 
            console.log(getWithdraw.error)
            :
            ''
    },[getWithdraw.error])

    useEffect(() => {
        // TODO: stages && stageList push
        (Stages.length > 0) && OrderInfo.data[0] ?
            init()
            :
            ''
    },[Stages])

    useEffect(() => {
        OrderInfo.data[0] ? 
            getInfo()
            :
            ''
    },[OrderInfo])

    useEffect(() => {
        getStagesJson({oid: location.search.split('?')[1]})
            .then(res => {
                if (res.signnonce !== null) {
                    console.log('hh==>',res.signnonce);
                    nonce = res.signnonce;
                    setNonce(nonce);
                }
                dataStages = res.stages;
                setDataStages({...dataStages});
            })
    },[])

    
    return <div className="Panel_stageInfo">
        
        <div className="stageInfo-title">
            项目阶段划分
        </div>
        {
            !orderStart ? 
                <div className="stageInfo-subtitle">
                    <Checkbox checked={advance} className={`subtitle-check ${advance ? 'mb10' : ''}`} onChange={onChange}>增加预付款 <span className='check-span'>项目方确认阶段划分后,你将得到预付款</span></Checkbox>
                    {
                        advance ? 
                            <InputNumber min={0} className='subtitle-inner' addonAfter={selectAfter} value={illM} onChange={e => {getAdvance(e), setIllM(e)}} />
                            :
                            ''
                    }
                </div>
                :
                ''
        }

        {
            who === 'worker' && info.progress === 4 ? 
                <div className="stageInfo-subtitle">
                    <Checkbox checked disabled className={`subtitle-check ${advance ? 'mb10' : ''}`}>预付款已支付</Checkbox>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <p style={{fontSize: '18px'}}>{info.advance}ETH</p>
                        <Button style={{width: '150px', height: '50px'}} onClick={() => gowithdraw(0)}>取款</Button>
                    </div>
                </div>
                :
                ''
        }
        
        {
            !editMode ? 
                <div className="stageInfo-signIn">
                    {
                        stageList.length === 0 ? 
                            <div className="signIn-empty">
                                <div className="empty-tips">
                                    需求方通过了你的申请,请完成阶段划分.
                                </div>
                                <Button className="empty-btn" onClick={() => addStage()}>建立阶段划分</Button>
                            </div>
                            :
                            <div className="signIn-list">
                                    <span className="add" onClick={() => addStage()}>Add+</span>
                                    <Card
                                        style={{
                                        width: '100%',
                                        }}
                                        tabList={stageList}
                                        activeTabKey={activeTabKey1}
                                        onTabChange={(key) => {
                                        onTab1Change(key);
                                        }}
                                    >
                                        <StageCard 
                                            amount={amount} 
                                            stage={stages[activeTabKey1]} 
                                            set={setStages} 
                                            stages={stages} 
                                            deleteStage={deleteStage}
                                            index={activeTabKey1}
                                        />
                                    </Card>
                                    <div className="btns">
                                        <Button className="btn">取消</Button>
                                        <Button className="btn" type="primary" onClick={() => isOk()}>编辑完成</Button>                              
                                    </div>
                            </div>
                    }
                </div>
                :
                <div className="stageInfo-inspection">
                    {
                        stages.map((e,i) => 
                            <StageInspection key={i} data={e} index={i} set={setEditMode} setTab={setActiveTabKey1} OrderStart={orderStart} Oid={Oid} Who={who} />
                        )
                    }
                    <Button onClick={() => appendStage()}>添加阶段</Button>
                    <Button onClick={() => payStage()}>支付阶段</Button>
                    <Button onClick={() => agreeApeend()}>同意添加</Button>
                </div>
        }
    </div>
}