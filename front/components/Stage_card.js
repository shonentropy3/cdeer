import { Button, InputNumber, Form, Input } from 'antd';
import { useEffect, useState } from 'react';

export default function StageCard(params) {

    const { amount } = params;
    const { TextArea } = Input;
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
        console.log(amount,e.value);
        stage.budget = amount * e.value;
        set([...stages]);
    }

    useEffect(() => {
    },[stage])

    return (
        <Form
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item label="阶段名称">
            <Input value={stage.title} onChange={e => {stage.title = e.target.value, set([...stages]);}}/>
        </Form.Item>

        <Form.Item label="阶段时长">
            <InputNumber min={1} addonAfter="DAY" value={stage.period} onChange={e => {stage.period = e, set([...stages]);}}/>
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
            <InputNumber min={1} addonAfter="ETH" value={stage.budget} onChange={e => {stage.budget = e, set([...stages]);}} />
        </Form.Item>

        <Form.Item label="阶段说明">
            <TextArea rows={4} value={stage.content} onChange={e => {stage.content = e.target.value, set([...stages]);}} />
        </Form.Item>

      </Form>
    )
}