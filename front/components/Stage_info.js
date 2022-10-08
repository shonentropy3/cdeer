import { Button, Card, Checkbox, InputNumber, message, Select, Tabs } from "antd";
import { useEffect, useRef, useState } from "react";
import { useAccount } from 'wagmi'
import { useContracts } from "../controller";
import Stage_card from "./Stage_card";
import Stage_list from "./Stage_list";



export default function Stage_info(props) {

    const { Query, Amount, OrderInfo, Data, Step, StagesData, isModify } = props;   //  StagesData 数据库阶段
    let [advance,setAdvance] = useState(false);
    let [stage0,setStage0] = useState();
    let [stages,setStages] = useState([]);   
    let [editMode,setEditMode] = useState(false);
    // Tabs
    const [activeKey, setActiveKey] = useState();   
    const [items, setItems] = useState([]);
    const newTabIndex = useRef(0);

    const { address } = useAccount()
    const { useOrderContractWrite: getWithdraw } = useContracts('withdraw');
    const { useOrderContractWrite: delivery } = useContracts('updateAttachment');
    const { useOrderContractWrite: confirm } = useContracts('confirmDelivery');
    const { useOrderContractWrite: abortOrder } = useContracts('abortOrder');
    const { useOrderContractWrite: prolongStage } = useContracts('prolongStage');


    const onChange = e => {
        // TODO: 修改预付款时更改Modify状态为false ===> 调用合并数组 concat
        advance = e.target.checked;
        setAdvance(advance);
        isModify(true);
        if (Data) {
            concat();
        }
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
        if (stages.length === 0) {
            return
        }
        if (advance && stage0 && (stages.length === 0 || stages[0].period !== 0)) {
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
        // TODO: 判断是否有空值
        isModify(true);
        concat()
        editMode = true;
        setEditMode(editMode);
        setStages([...stages]);
    };

    const isCancel = () => {
        setEditMode(true)
        if (Data && Data.length > 0) {
            init();
        }
    }

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
        isModify(true);
        if (Data) {
            concat();
        }
    }

    const init = () => {
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

    const gowithdraw = () => {
        getWithdraw.write({
            recklesslySetUnpreparedArgs: [
                Query.oid, address
            ]
        })
    }

    useEffect(() => {
        if (Data && Data.length > 0) {
            init();
        }
    },[Data])

    useEffect(() => {
        getWithdraw.isSuccess ? message.success('取款成功') : '';
    },[getWithdraw.isSuccess])

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
                    Query.who === 'worker' && Step === 1 && stage0 ? 
                        <div className="stageInfo-subtitle">
                            <Checkbox checked disabled className={`subtitle-check ${advance ? 'mb10' : ''}`}>预付款已支付</Checkbox>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <p style={{fontSize: '18px'}}>{stage0}ETH</p>
                                <Button style={{width: '150px', height: '50px'}} onClick={() => gowithdraw()}>取款</Button>
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
                                                <Button className="btn" onClick={() => isCancel()}>取消</Button>
                                                <Button className="btn" type="primary" onClick={() => isOk()}>编辑完成</Button>                              
                                            </div> 
                                    </div>
                            }
                        </div>
                        :
                        <div className="stageInfo-inspection">
                            {
                                stages.map((e,i) => 
                                    <Stage_list 
                                        key={i} 
                                        index={i} 
                                        data={e} 
                                        stages={Data} 
                                        set={setEditMode} 
                                        setTab={setActiveKey} 
                                        Query={Query} 
                                        Step={Step} 
                                        del={del}
                                        delivery={delivery}
                                        confirm={confirm}
                                        abortOrder={abortOrder}
                                        prolongStage={prolongStage}
                                    />
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