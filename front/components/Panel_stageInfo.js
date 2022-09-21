import { Checkbox, Button, Card, message } from 'antd';
import { useEffect, useState } from 'react';
import { InputNumber, Select } from 'antd';
import StageCard from './Stage_card';
import StageInspection from './Stage_inspection';
import { useContracts, useReads } from '../controller';
import { useAccount } from 'wagmi'


export default function Panel_stageInfo(props) {
    
    const { Oid } = props;
    const { who } = props;
    const { OrderInfo } = props;
    const { amount } = props;
    const { Stages } = props;
    const { getStages } = props;
    const { getAdvance } = props;
    const { Option } = Select;
    let [advance,setAdvance] = useState(false);
    let [stageList,setStageList] = useState([]);
    let [stages,setStages] = useState([]);
    let [editMode,setEditMode] = useState(false);
    let [illM,setIllM] = useState(0);
    const [activeTabKey1, setActiveTabKey1] = useState('0');
    let [orderStart, setOrderStart] = useState(false);
    let [info,setInfo] = useState({});
    const { useOrderContractWrite: getWithdraw, orderConfig } = useContracts('withdraw');
    const { useStageReads } = useReads('pendingWithdraw',[1])
    const { address } = useAccount()

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
    
    const withdraw = () => {
        let data = useStageReads.data[0];
        let pending = data.pending.toString() / Math.pow(10,18)
        console.log(Oid);
        return
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
        Stages.length > 0 ?
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
                        <Button style={{width: '150px', height: '50px'}} onClick={() => withdraw(0)}>取款</Button>
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
                </div>
        }
    </div>
}