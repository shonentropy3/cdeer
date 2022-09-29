import { Button, Card, Checkbox, InputNumber, Select, Tabs } from "antd";
import { useEffect, useRef, useState } from "react";
import Stage_card from "./Stage_card";
import Stage_inspection from "./Stage_inspection";
import Stage_list from "./Stage_list";



export default function Stage_info(props) {

    const { Query } = props;
    const { Amount } = props;
    const { OrderInfo } = props;
    const { Data } = props;     //  数据库阶段
    const { Step } = props;
    const { StagesData } = props;
    let [advance,setAdvance] = useState(false);
    let [stage0,setStage0] = useState();
    let [stages,setStages] = useState([]);   
    let [editMode,setEditMode] = useState(false);

    // Tabs
    const [activeKey, setActiveKey] = useState();   
    const [items, setItems] = useState([]);
    const newTabIndex = useRef(0);

    const onChange = e => {
        advance = e.target.checked;
        setAdvance(advance);
    }

    const add = () => {
        const newActiveKey = `newTab${newTabIndex.current++}`;
        const newPanes = [...items];
        const newIndex = stage0 ? stages.length : stages.length+1;
        stages.push({
            key: newActiveKey,
            stageIndex: newIndex + 1,
            title: '',
            budget: '',
            period: '',
            content: '',
            percent: '' 
        })
        newPanes.push({
            label: 'P' + newIndex,
            children: <Stage_card stage={stages[stages.length - 1]} amount={Amount} set={setStages} stages={stages} />,
            key: newActiveKey,
            closable: false
        });
        setStages([...stages]);
        setItems(newPanes);
        setActiveKey(newActiveKey);
    };

    const remove = (targetKey) => {
        let newActiveKey = activeKey;
        let lastIndex = -1;
        items.forEach((item, i) => {
            if (item.key === activeKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = items.filter((item) => item.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
          if (lastIndex >= 0) {
            newActiveKey = newPanes[lastIndex].key;
          } else {
            newActiveKey = newPanes[0].key;
          }
        }
        setStages([...stages]);
        setItems(newPanes);
        setActiveKey(newActiveKey);
    };

    const onEdit = (targetKey, action) => {
        if (action === 'add') {
          add();
        } else {
          remove(targetKey);
        }
    };

    const concat = () => {
        if (stage0 && (stages.length === 0 || stages[0].period !== 0)) {
            let obj = {
                budget: stage0,
                period: 0
            }
            stages.unshift(obj);
        }else if (!stage0 && stages.length !== 0 && stages[0].period === 0) {
            stages.splice(0,1);
        }else if(stages[0].period === 0){
            stages[0].budget = stage0
        }
        StagesData([...stages])
    }

    const isOk = () => {
        // TODO: 判断是否有空值 ==> 合并预付款
        concat()
        editMode = true;
        setEditMode(editMode);
        setStages([...stages]);
    };

    const del = (index) => {
        // TODO: 加上预付款判断   有的话则index+1
        stages.splice(index,1);
        items.splice(index,1);
        items.map((e,i) => {
            e.label = 'P'+(i+1)
        })
        if (stages.length === 0) {
            setEditMode(false);
        }
        setStages([...stages]);
        setItems([...items]);
    };

    const change0 = (e) => {
        stage0 = e;
        setStage0(stage0);
        concat();
    }

    useEffect(() => {
        if (Data && Data.length > 0) {
            setEditMode(true);
            let arr = [];
            let cards = [];
            Data.map(e => {
                if(e.period === 0){
                    setAdvance(true);
                    stage0 = e.budget;
                    setStage0(stage0);
                }else{
                    const key = `newTab${newTabIndex.current++}`;
                    let obj = {
                        ...e,
                        key: key,
                        stageIndex: arr.length + 1,
                    }
                    arr.push(obj);
                    cards.push({
                        label: 'P' + arr.length,
                        children: <Stage_card stage={arr[arr.length - 1]} amount={Amount} set={setStages} stages={stages} />,
                        key: key,
                        closable: false
                    });
                }
            })
            stages = arr;
            setStages([...stages]);
            setItems(cards);
        }
    },[Data])

    return <div className="Stage_info">
                <div className="stageInfo-title"> 项目阶段划分 </div>
                 {
                    Step === 0 ? 
                        <div className="stageInfo-subtitle">
                            <Checkbox checked={advance} className={`subtitle-check ${advance ? 'mb10' : ''}`} onChange={onChange}>增加预付款 <span className='check-span'>项目方确认阶段划分后,你将得到预付款</span></Checkbox>
                            { 
                                advance ? 
                                  <InputNumber defaultValue={stage0} min={0} className='subtitle-inner' addonAfter={<Select defaultValue="ETH" disabled />} onChange={e => change0(e)} />
                                  :
                                  ''
                            }
                        </div> : ''
                }
                {
                    Query.who === 'worker' && Step === 1 ? 
                        <div className="stageInfo-subtitle">
                            <Checkbox checked disabled className={`subtitle-check ${advance ? 'mb10' : ''}`}>预付款已支付</Checkbox>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <p style={{fontSize: '18px'}}>{info.advance}ETH</p>
                                <Button style={{width: '150px', height: '50px'}} onClick={() => gowithdraw(0)}>取款</Button>
                            </div>
                        </div> : ''
                }
                {
                    !editMode ? 
                        <div className="stageInfo-signIn">
                            {
                                items.length === 0 ? 
                                    <div className="signIn-empty">
                                        <div className="empty-tips">
                                            需求方通过了你的申请,请完成阶段划分.
                                        </div>
                                        <Button className="empty-btn" onClick={() => add()}>建立阶段划分</Button>
                                    </div>
                                    :
                                    <div className="signIn-list">
                                        <Tabs
                                            type="editable-card"
                                            onChange={(newActiveKey) => {setActiveKey(newActiveKey)}}
                                            activeKey={activeKey}
                                            onEdit={onEdit}
                                            items={items}
                                            style={{ width: '100%' }}
                                        />
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
                                    <Stage_list key={i} index={i} data={e} set={setEditMode} setTab={setActiveKey} Query={Query} Step={Step} del={del}/>
                                )
                            }
                            {
                                Step === 1 ? 
                                <>
                                    <Button onClick={() => appendStage()}>添加阶段</Button>
                                    <Button onClick={() => payStage()}>支付阶段</Button>
                                    <Button onClick={() => agreeApeend()}>同意添加</Button>
                                </> : ''
                            }
                        </div>
                }
            </div>
}