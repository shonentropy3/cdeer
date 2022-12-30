import { Button, Input, InputNumber, message } from "antd";
import { useEffect, useState } from "react";
const { TextArea } = Input;


export default function StageInner(params) {
    
    const { defaultAmount, index, inner, setInner, setViewModel, setDataViewModel } = params;
    const [percent, setPercent] = useState([
        {title: '10%', value: 0.1, active: false},
        {title: '25%', value: 0.25, active: false},
        {title: '50%', value: 0.5, active: false},
        {title: '75%', value: 0.75, active: false},
        {title: '100%', value: 1, active: false}
    ])
    let [amount,setAmount] = useState();

    const changePercent = (i) => {
        percent.map(e => {
            e.active = false;
        })
        percent[i].active = true;
        setPercent([...percent]);

        // 百分比
        if (defaultAmount !== 0) {
            inner[index].amount = defaultAmount * percent[i].value;
            setInner({...inner})
            amount = inner[index].amount;
            setAmount(amount);
        }
    }

    const onChange = (key, value) => {
        inner[index][key] = value;
        setInner({...inner});
        if (key === 'amount') {
            percent.map(e => {
                e.active = false;
            })
            setPercent([...percent]);
            amount = value;
            setAmount(amount);
        }
    }

    const confirm = () => {
        // 判断是否有空指针
        let flag = true;
        for (const i in inner[index]) {
            if (!inner[index][i]) {
                flag = false;
            }
        }
        if (!flag) {
            message.error('请填写完成')
            return
        }
        setViewModel(true);
        setDataViewModel(false);
    }

    useEffect(() => {
        if (inner[index]?.amount) {
            amount = inner[index]?.amount;
            setAmount(amount);
        }
    },[])

    return <div className="stageInner">
        <div className="inner">
            <p className="inner-title">Stage Name</p>
            <Input className="name" defaultValue={inner[index]?.name} onChange={(e) => onChange('name', e.target.value)} />
        </div>
        <div className="inner">
            <p className="inner-title">Delivery duration</p>
            <div className="flex">
                <InputNumber className="period" defaultValue={inner[index]?.period} onChange={(e) => onChange('period', e)} /> 
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
                    <InputNumber 
                        className="amount" 
                        defaultValue={inner[index]?.amount} 
                        value={amount}
                        onChange={(e) => onChange('amount', e)} 
                    /> 
                    {/* <p>currency</p> */}
                </div>
            </div>
        </div>
        <div className="inner">
            <p className="inner-title">Delivery duration</p>
            <TextArea defaultValue={inner[index]?.desc} onChange={(e) => onChange('desc', e.target.value)} />
        </div>
        <Button className="confirm" onClick={() => confirm()}>Confirm</Button>
    </div>
}