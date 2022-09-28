import { Button, Card, Checkbox, InputNumber, Select, Tabs } from "antd";
import { useRef, useState } from "react";
import Stage_card from "./Stage_card";
import Stage_inspection from "./Stage_inspection";
import Stage_list from "./Stage_list";



export default function Stage_info(props) {

    const { Query } = props;
    const { Amount } = props;
    const { OrderInfo } = props;
    const { Step } = props;
    let [advance,setAdvance] = useState(false);   
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
        stages.push({
            key: newActiveKey,
            stageIndex: stages.length + 1,
            title: '',
            budget: '',
            period: '',
            content: '',
            percent: ''
        })
        newPanes.push({
            label: 'P' + stages.length,
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

    const isOk = () => {;
        editMode = true;
        setEditMode(editMode);
        setStages([...stages]);
    }

    const del = (index) => {
        // TODO: 加上预付款判断   有的话则index+1
        stages.splice(index,1);
        items.splice(index,1);
        items.map((e,i) => {
            e.label = 'P'+(i+1)
        })
        setStages([...stages]);
        setItems([...items]);
    }

    return <div className="Stage_info">
                <div className="stageInfo-title"> 项目阶段划分 </div>
                 {
                    Step === 0 ? 
                        <div className="stageInfo-subtitle">
                            <Checkbox checked={advance} className={`subtitle-check ${advance ? 'mb10' : ''}`} onChange={onChange}>增加预付款 <span className='check-span'>项目方确认阶段划分后,你将得到预付款</span></Checkbox>
                            { 
                                advance ? 
                                  <InputNumber min={0} className='subtitle-inner' addonAfter={<Select defaultValue="ETH" disabled />} onChange={e => {getAdvance(e), setIllM(e)}} />
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
                            
                            {/* {
                                stages.map((e,i) => 
                                    <Stage_inspection key={i} data={e} index={i} set={setEditMode} setTab={setActiveKey} Step={Step} Query={Query} />
                                )
                            } */}
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