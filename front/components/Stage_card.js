import { Button, InputNumber, Form, Input } from 'antd';
import { useEffect, useState } from 'react';

export default function Stage_card(params) {

    const { TextArea } = Input;
    const { amount } = params;
    const { stage } = params;
    const { stages } = params;
    const { set } = params;
    let [data,setData] = useState({
        budget: '', content: '', key: '', percent: '', period: '', stageIndex: '', title: ''
    });
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
        if (stage) {
            selectPercent = stage.percent;
            setSelectPercent(selectPercent);
        }
    },[stage])

    useEffect(() => {
        if (stage) {
            data = stage;
            setData(data);
        }
    },[])

    return (
        <div style={{padding: '20px'}}>
            <Form
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                fields={[
                    { "name": ["title"], "value": data.title },
                    { "name": ["period"], "value": data.period },
                    { "name": ["budget"], "value": data.budget },
                    { "name": ["content"], "value": data.content },
                  ]}
            >
            <Form.Item label="阶段名称" name="title">
                <Input onChange={e => onchange('title',e.target.value)}/>
            </Form.Item>

            <Form.Item label="阶段时长" name="period">
                <InputNumber min={1} addonAfter="DAY" onChange={e => onchange('period',e)}/>
            </Form.Item>
            <div className="check-percent">
                    {
                        percent.map((e,i) => 
                            <div 
                                key={i} 
                                className={`li ${selectPercent === e.title ? 'active' : ''}`}
                                onClick={() => checkPercent(e)}
                            >{e.title}</div>
                        )
                    }
                    <Form.Item label="阶段费用" name='budget'>
                        <InputNumber min={1} addonAfter="ETH" onChange={e => changeBudget(e)} />
                    </Form.Item>
            </div>
            

            <Form.Item label="阶段说明" name="content">
                <TextArea rows={4} onChange={e => onchange('content',e.target.value)} />
            </Form.Item>
            </Form>
      </div>
    )
}