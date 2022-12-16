import { Button, Tabs } from "antd";
import { useState } from "react";



export default function InnerStageCard(params) {
    
    let [items,setItems] = useState([]);    //  tabs

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

    return <>
        {
            items.length === 0 ?
            <div>
                <Button className="btn-add mb60" onClick={add}>Establish</Button>
            </div>
            : 
            <Tabs type="editable-card" items={items} onEdit={onEdit} /> 
        }
    </>
}