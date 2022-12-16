import { useRequest, useSetState } from "ahooks";
import { Button, Input, InputNumber, Tabs } from "antd";
import { useEffect, useState } from "react";
import StageInner from "../CustomItem/StageInner";



export default function InnerStageCard(params) {
    

    const { defaultAmount, getInner } = params;

    let [items,setItems] = useState([]);    //  tabs
    let [inner,setInner] = useState({});    //  参数

    const { run } = useRequest(getInner, {
        debounceWait: 1000,
        manual: true,
    });

    // 子组件修改时更新当前组建inner
    const changeInner = (obj) => {
        setInner({...obj});
    }

    // 添加tabs
    const add = () => {
        const index = items.length + 1;

        // 收集各阶段参数
        inner[`item-${index}`] = {
            name: '', period: '', amount: '', desc: ''
        }
        setInner({...inner})
        setItems([
          ...items,
          {
            label: `P ${index}`,
            children: <StageInner 
                        defaultAmount={defaultAmount} 
                        index={`item-${index}`}
                        inner={inner}
                        setInner={changeInner} 
                      />,
            key: `item-${index}`,
          },
        ]);
    };

    // 移除tabs
    const remove = (targetKey) => {
        items.map((e,i) => {
            if (e.key === targetKey) {
                items.splice(i,1);
                delete inner[targetKey];
            }
        })
        items.map((e,i) => {
            e.key = `item-${i+1}`;
            e.label = `P ${i+1}`;
        })
        // inner重新排序
        let obj = {};
        let num = 1;
        for (const i in inner) {
            obj[`item-${num}`] = inner[i];
            num++;
        }
        setItems([...items]);
        setInner({...obj});
    };

    // tabs事件处理
    const onEdit = (targetKey, action) => {
        if (action === 'add') {
          add();
        } else {
          remove(targetKey);
        }
    };

    // 监听inner改变 ==> 返回给上一级
    useEffect(() => {
        run(inner)
    },[inner])

    return <>
        {
            items.length === 0 ?
            <div>
                <Button className="btn-add mb60" onClick={add}>Establish</Button>
            </div>
            : 
            <Tabs type="editable-card" className="tabs" items={items} onEdit={onEdit} /> 
        }
    </>
}