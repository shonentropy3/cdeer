import { Button, Input, InputNumber, message } from "antd";
import { useEffect, useState } from "react";
const { TextArea } = Input;


export default function AppendStage(params) {
    
    const { setInner, inner, cancel, updateAppend, isLoading } = params;
    const [percent, setPercent] = useState([
        {title: '10%', value: 0.1, active: false},
        {title: '25%', value: 0.25, active: false},
        {title: '50%', value: 0.5, active: false},
        {title: '75%', value: 0.75, active: false},
        {title: '100%', value: 1, active: false}
    ])

    const changePercent = (i) => {
        percent.map(e => {
            e.active = false;
        })
        percent[i].active = true;
        setPercent([...percent]);
    }

    const onChange = (key, value) => {
        inner[key] = value;
        setInner({...inner})
    }

    const hidden = () => {
        setInner({
            name: '', period: '', amount: '', desc: ''
        });
        cancel(false);
    }

    const confirm = () => {
        // 判断是否有空指针
        let flag = true;
        for (const i in inner) {
            if (!inner[i]) {
                flag = false;
            }
        }
        if (!flag) {
            message.error('请填写完成')
            return
        }
        // 发起签名
        updateAppend()
    }

    return <div className="stageInner">
        <div className="inner">
            <p className="inner-title">Stage Name</p>
            <Input className="name" onChange={(e) => onChange('name', e.target.value)} />
        </div>
        <div className="inner">
            <p className="inner-title">Delivery duration</p>
            <div className="flex">
                <InputNumber min={0} className="period" onChange={(e) => onChange('period', e)} /> 
                <p>Day</p>
            </div>
        </div>
        <div className="inner">
            <p className="inner-title">Stage cost</p>
            <div className="percent">
                <div className="percent-list">
                    {
                        percent.map((e,i) => 
                            <div 
                                className={`percent-item ${e.active ? 'percent-item-active' : ''}`} 
                                key={i}
                                onClick={() => changePercent(i)}
                            >
                                {e.title}
                            </div>
                        )
                    }
                </div>
                <div className="flex">
                    <InputNumber min={0} className="amount" onChange={(e) => onChange('amount', e)} /> <p>currency</p>
                </div>
            </div>
        </div>
        <div className="inner">
            <p className="inner-title">Delivery duration</p>
            <TextArea onChange={(e) => onChange('desc', e.target.value)} />
        </div>
        <div className="btns">
        <Button disabled={isLoading} className="confirm" onClick={() => hidden()}>Cancel</Button>
        <Button loading={isLoading} className="confirm" onClick={() => confirm()}>Confirm</Button>
        </div>
    </div>
}