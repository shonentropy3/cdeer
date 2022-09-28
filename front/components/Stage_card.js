import { Button, InputNumber, Form, Input } from 'antd';
import { useEffect, useState } from 'react';

export default function Stage_card(params) {

    const { TextArea } = Input;
    const { amount } = params;
    const { stage } = params;
    const { stages } = params;
    const { set } = params;
    let [selectPercent,setSelectPercent] = useState();
    let [percent,setPercent] = useState([
        {title: '10%', value: 0.1},
        {title: '25%', value: 0.25},
        {title: '50%', value: 0.5},
        {title: '75%', value: 0.75},
        {title: '100%', value: 1}
    ])

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    const checkPercent = e => {
        selectPercent = e.title;
        setSelectPercent(selectPercent);
        stage.budget = amount * e.value;
        stage.percent = e.title;
        set([...stages]);
    }

    const changeBudget = e => {
        stage.budget = e;
        stage.percent = '';
        set([...stages]);
        selectPercent = '';
        setSelectPercent(selectPercent);
    }

    const onchange = (name,value) => {
        stage[name] = value;
    }

    useEffect(() => {
        selectPercent = stage.percent;
        setSelectPercent(selectPercent);
    },[stage])

    return (
        <div style={{padding: '20px'}}>
            <Form
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
            <Form.Item label="阶段名称">
                <Input defaultValue={stage.title} onChange={e => onchange('title',e.target.value)}/>
            </Form.Item>

            <Form.Item label="阶段时长">
                <InputNumber defaultValue={stage.period} min={1} addonAfter="DAY" onChange={e => onchange('period',e)}/>
            </Form.Item>

            <Form.Item label="阶段费用" className="check-percent">
                <div className="list">
                    {
                        percent.map((e,i) => 
                            <div 
                                key={i} 
                                className={`li ${selectPercent === e.title ? 'active' : ''}`}
                                onClick={() => checkPercent(e)}
                            >{e.title}</div>
                        )
                    }
                </div>
                <InputNumber min={1} addonAfter="ETH" value={stage.budget} onChange={e => changeBudget(e)} />
            </Form.Item>

            <Form.Item label="阶段说明">
                <TextArea rows={4} defaultValue={stage.content} onChange={e => onchange('content',e.target.value)} />
            </Form.Item>
            </Form>
      </div>
    )
}