import { Button, Card, Checkbox, InputNumber, message, Select, Tabs } from "antd";
import { ethers } from "ethers";
import { useEffect, useRef, useState } from "react";
import { useAccount, useNetwork } from 'wagmi'
import { multicallWrite, muticallEncode, useContracts, useRead, useSignAppendData } from "../controller";
import { getProlongStage, updateSignature } from "../http/api/order";
import { getDate } from "../utils/getDate";


import Stage_card from "./Stage_card";
import Stage_list from "./Stage_list";



export default function Stage_info(props) {

    const { Query, Amount, OrderInfo, Data, Step, StagesData, isModify, Attachment, permitNonce } = props;   //  StagesData 数据库阶段
    let [advance,setAdvance] = useState(false);
    let [stage0,setStage0] = useState();
    let [stages,setStages] = useState([]);   
    let [appendStages,setAppendStages] = useState([{budget:'',percent:'',title:'',content:'',period: ''}]);   
    let [editMode,setEditMode] = useState(false);
    // Tabs
    const [activeKey, setActiveKey] = useState();   
    const [items, setItems] = useState([]);
    const newTabIndex = useRef(0);
    // appendStage
    let [multicall,setMulticall] = useState([]);
    const [append, setAppend] = useState(false);
    let [deadline,setDeadline] = useState();
    let [nonce,setNonce] = useState();
    let [appendObj,setAppendObj] = useState({});  //  新增阶段签名
    let [isSigner,setIsSigner] = useState(false);   //  签名flag


    
    const { chain } = useNetwork();
    const { address } = useAccount()
    const { useOrderRead: nonces } = useRead('nonces', address);
    const { useOrderContractWrite: getWithdraw } = useContracts('withdraw');
    const { useOrderContractWrite: delivery } = useContracts('updateAttachment');
    const { useOrderContractWrite: confirm } = useContracts('confirmDelivery');
    const { useOrderContractWrite: abortOrder } = useContracts('abortOrder');
    const { useOrderContractWrite: prolongStage } = useContracts('prolongStage');
    const { useOrderContractWrite: useAppendStage } = useContracts('appendStage');
    const { useSign, obj } = useSignAppendData(appendObj);  //  延长签名


   

    const appendStage = () => {
        // TODO: 添加阶段==>签名
        let data = appendStages[0];
        let now = parseInt(new Date().getTime()/1000);
        let setTime = 2 * 24 * 60 * 60;
        let period = data.period * 24 * 60 * 60;
        deadline = now+setTime;
        setDeadline(deadline);
        let amount = ethers.utils.parseEther(`${data.budget}`);
        let obj = {
            chainId: chain.id,  //  id
            orderId: Query.oid,
            amount: amount,
            period: period,
            nonce: nonce,    //  id nonce form sql? or chain
            deadline: `${deadline}`,
        }
        appendObj = obj;
        setAppendObj({...appendObj})
        setIsSigner(true);
    }

    // 计算阶段划分的费用和数据
    const total = () => {
        if (!Data) {
            return
        }
        let allPeriod = 0;
        let allTotal = 0;
        let now = new Date().getTime();
        return <>
                {
                    Data.map((e,i) => {
                        allPeriod += e.period;
                        allTotal += e.budget;
                        if (e.period === 0) {
                            return <p className="worker-total-advance" key={i}>Advance charge：<span>{Data[0].budget}ETH</span></p>
                        }else{
                            let p = Data[0].period === 0 ? i : i+1;
                            return <p className="worker-total-stageCost" key={i}>P{p} stage cost: <span>{e.budget}ETH</span></p>
                        }})
                }
                <p className="worker-total-estimated">Estimated time：<span>{allPeriod}</span>DAYS</p>
                <p className="worker-total-cycle">Development cycle：<span>{getDate(now,'d')} / {getDate(now + (allPeriod * 24 * 60 * 60 * 1000),'d')}</span></p>
                <strong className="worker-total-totalExpenses">Total expenses：<span>{allTotal} ETH</span></strong>
        </>
    }

    

    // 甲方确认新增并付款
    const pay = async() => {
        let amount = ethers.utils.parseEther(`${appendStages[0].budget}`);
        let data = '';
        await getProlongStage({oid: Query.oid})
        .then(res => {
            if (res.code === 200) {
                data = res.data;
            }else{
                message.error('支付失败')
                return
            }
        })
        let arr = [];
        arr.push({
            functionName: 'payOrder',
            params: [Query.oid, amount]
        })
        arr.push({
            functionName: 'appendStage',
            params: [
                Query.oid, 
                ethers.utils.parseEther(`${data.stages.amount[data.stages.amount.length - 1]}`),
                (data.stages.period[data.stages.period.length - 1] * 24 * 60 * 60), 
                permitNonce, 
                data.stages.deadline,
                '0x' + data.signature.substring(2).substring(128, 130),
                '0x' + data.signature.substring(2).substring(0, 64),
                '0x' + data.signature.substring(2).substring(64, 128)
            ]
        })
        multicall = arr;
        setMulticall([...multicall]);
        let params = muticallEncode(multicall);
        multicallWrite(params,address,amount)
        .then(res => {
            message.success('支付成功')
            setTimeout(() => {
                history.go(0)
            }, 500);
        })
    }

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
                if (e.append) {
                    appendStages[0] = e;
                    setAppendStages([...appendStages]);
                }
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

    useEffect(() => {
        if (nonces.data) {
            setNonce(nonces.data.toString());
        }
    },[nonces.data])

    // 新增
    useEffect(() => {
        if (obj.chainId && isSigner) {
            useSign.signTypedData();
        }
    },[appendObj])

    useEffect(() => {
        if (useSign.data && isSigner) {
            setIsSigner(false);
            let _amounts = [];
            let _periods = [];
            let flag = false;   // 判断此次操作是否是 『修改』 还是 「新增」 
            Data.map(e => {
                _amounts.push(e.budget);
                _periods.push(e.period);
                if (e.append) {
                    flag = true;
                }
            })
            if (!flag) {
                // 新增操作执行PUSH
                _amounts.push(appendStages[0].budget);
                _periods.push(appendStages[0].period);
                Attachment.stages.push({
                    milestone: {type: '', content: appendStages[0].content, title: appendStages[0].title},
                    delivery: {attachment: '', content: '', fileType: ''},
                })
            }else{
                Attachment.stages[Attachment.stages.length - 1] = {
                    milestone: {type: '', content: appendStages[0].content, title: appendStages[0].title},
                    delivery: {attachment: '', content: '', fileType: ''},
                }
            }
            let obj = {
                amount: _amounts, period: _periods, deadline: deadline
            }
            updateSignature({signature: useSign.data, signaddress: address, stages: JSON.stringify(obj), oid: Query.oid, nonce: nonce, json: JSON.stringify(Attachment)})
            .then(res => {
                message.success('申请成功,等待对方同意!')
                setAppend(false);
                setTimeout(() => {
                    history.go(0);
                }, 500);
            })
        }
    },[useSign.data])

 

    return <div className="order-stage"><div className="Stage_info">
                <div className="stageInfo-title">Task stage division</div>
                 {
                    Step === 0 ? 
                        <div className="stageInfo-subtitle">
                            <Checkbox checked={advance} className={`subtitle-check ${advance ? 'mb10' : ''}`} onChange={onChange}><span className='check-span'>Increase advance payment<i>?</i></span></Checkbox>
                            { 
                                advance ? 
                                  <InputNumber controls={false} defaultValue={stage0} min={0} className='subtitle-inner' addonAfter={<span>ETH</span>} onChange={e => change0(e)} />
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
                                        <Button className="empty-btn" onClick={() => add()}><span className="empty-icon-add">+</span> Establish</Button>
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
                                                <Button className="btn" onClick={() => isCancel()}>Cancel</Button>
                                                <Button className="btn" type="primary" onClick={() => isOk()}>Confirm</Button>                              
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
                                        modifyAppend={setAppend}
                                        pay={pay}
                                        permitApeend={appendStage}
                                        permitNonce={permitNonce}
                                        Attachment={Attachment}
                                    />
                                )
                            }
                            {
                                append ? <>
                                <Stage_card stage={appendStages[0]} amount={Amount} set={setAppendStages} stages={appendStages}/>
                                <Button onClick={() => {setAppend(false)}}>Cancel</Button>
                                <Button onClick={() => appendStage()}>Confirm</Button>
                                </>:''
                            }
                            {
                                Step === 1 ? 
                                <div style={{display: "flex", justifyContent: "center"}}>
                                    <Button onClick={() => {setAppend(true)}}>添加阶段</Button>
                                </div> : ''
                            }
                        </div>
                }
                <div className="worker-total">{total()}</div>
            </div>
            </div>
}