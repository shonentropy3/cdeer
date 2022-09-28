import { Input, Select, Button } from "antd"
import { useEffect } from "react";

const {TextArea} = Input

export default function Modal_applyTask (props) {
   
    const { setParams, params, submit } = props;

    const onchange = (e,type) => {
        params[type] = e;
        setParams({...params});
    }

    useEffect(() => {
        params.contactName = 'telegram';
        setParams({...params});
    },[])

    return <>
        <p>报名此项目<span>X</span></p>
        <div>
            <div>
                <div></div>
                <div>
                    <p>数据系统开发</p>
                    <p>技术要求：</p>
                    <p>项目周期：</p>
                </div>
                <div>
                    <p>项目估算：</p>
                    <p></p>
                </div>
            </div>
            <p>项目文档：</p>
        </div>
        <div>
            <p>报名信息</p>
            <div>
                <p>给出你的报价</p>
                <Input className="applyPrice" onChange={e => onchange(e.target.value,'valuation')} />
                <Select defaultValue="1" onChange={(e) => onchange(e,'currency')} disabled >
                    <Option value="1">ETH</Option>
                </Select>
                <p>自我推荐</p>
                <TextArea rows={4} onChange={e => onchange(e.target.value,'desc')} />
                <p>联系方式</p>
                <Select defaultValue="telegram" onChange={(e) => onchange(e,'contactName')} >
                    <Option value="telegram">telegram</Option>
                    <Option value="wechat">wechat</Option>
                    <Option value="skype">skype</Option>
                </Select>
                <Input className="applyPrice" onChange={e => onchange(e.target.value,'contactValue')} />
            </div>
            <Button onClick={() => submit()}>报名参与</Button>
        </div>
    </>
}

