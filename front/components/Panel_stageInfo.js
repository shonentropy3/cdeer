import { Checkbox, Button, Card } from 'antd';
import { useState } from 'react';
import { InputNumber, Select } from 'antd';
import StageCard from './Stage_card';
import StageInspection from './Stage_inspection';


export default function Panel_stageInfo(props) {

    const { amount } = props;
    const { getStages } = props;
    const { getAdvance } = props;
    const { Option } = Select;
    let [advance,setAdvance] = useState(false);
    let [stageList,setStageList] = useState([]);
    let [stages,setStages] = useState([]);
    let [editMode,setEditMode] = useState(false);
    let [illM,setIllM] = useState(0);
    const [activeTabKey1, setActiveTabKey1] = useState('0');



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

    
    return <div className="Panel_stageInfo">
        <div className="stageInfo-title">
            项目阶段划分
        </div>
        <div className="stageInfo-subtitle">
            <Checkbox className={`subtitle-check ${advance ? 'mb10' : ''}`} onChange={onChange}>增加预付款 <span className='check-span'>项目方确认阶段划分后,你将得到预付款</span></Checkbox>
            {
                advance ? 
                    <InputNumber min={0} className='subtitle-inner' addonAfter={selectAfter} defaultValue={illM} onChange={e => {getAdvance(e), setIllM(e)}} />
                    :
                    ''
            }
        </div>
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
                            <StageInspection key={i} data={e} index={i} set={setEditMode} setTab={setActiveTabKey1} />
                        )
                    }
                </div>
        }
    </div>
}