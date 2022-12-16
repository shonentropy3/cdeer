import { useSetState } from "ahooks";
import { Button, Checkbox, InputNumber, Tabs } from "antd";
import { useState } from "react";



export default function OrderStageList(params) {
    
    let [items,setItems] = useState([]);    //  tabs
    let [stage, setStage] = useSetState({
        orderModel: false,      //  预付款模式
    });

    //  切换order模式 ==> 预付款
    const toggleModel = (e) => {
        setStage({orderModel: e.target.checked})
    }

    // 添加tabs
    const add = () => {
        const index = items.length + 1;
        setItems([
          ...items,
          {
            label: `项目 ${index}`,
            children: `内容 ${index}`,
            key: `item-${index}`,
          },
        ]);
    };

    // 移除tabs
    const remove = (targetKey) => {
        items.map((e,i) => {
            if (e.key === targetKey) {
                items.splice(i,1);
            }
        })
        items.map((e,i) => {
            e.key = `item-${i+1}`;
            e.label = `项目 ${i+1}`;
        })
        setItems([...items]);
    };

    // tabs事件处理
    const onEdit = (targetKey, action) => {
        if (action === 'add') {
          add();
        } else {
          remove(targetKey);
        }
    };

    return (
        <>
        <div className="stageCard">
            <p className="title">Task stage division</p>
            <div className="payModel">
                <Checkbox checked={stage.orderModel} onChange={toggleModel}>
                    Increase advance payment
                </Checkbox>
                {
                    stage.orderModel && 
                    <InputNumber
                        min={0} 
                        className='subtitle-inner' 
                        addonAfter={<span>ETH</span>} 
                        onChange={e => change0(e)} 
                    />
                }
            </div>
            {
                items.length === 0 ?
                <Button className="btn-add">Establish</Button>
                : 
                <Tabs type="editable-card" items={items} onEdit={onEdit} /> 
            }
        </div>
        </>
    )
}