import { Button, InputNumber, Form, Input } from 'antd';
import { useEffect, useState } from 'react';

export default function StageCard(params) {

    const { TextArea } = Input;
    const { stage } = params;
    const { stages } = params;
    const { set } = params;
    let [test,setTest] = useState(false);

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

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

        <Form.Item label="阶段费用">
            <InputNumber min={1} addonAfter="ETH" value={stage.budget} onChange={e => {stage.budget = e, set([...stages]);}} />
        </Form.Item>

        <Form.Item label="阶段说明">
            <TextArea rows={4} value={stage.content} onChange={e => {stage.content = e.target.value, set([...stages]);}} />
        </Form.Item>

      </Form>
    )
}