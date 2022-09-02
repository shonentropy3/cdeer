import { useState } from "react"
import { Input, Select, InputNumber, Button, Modal } from 'antd';
const { TextArea } = Input;
const { Option } = Select;
export default function Publish() {

    const [inner,setInner] = useState([
        {title: '项目名称', type: 'input', value: ''},
        {title: '项目描述', type: 'textarea', value: ''},
        {title: '', type: 'upload', value: ''},
        {title: '项目类型', type: 'model', value: []},
        {title: '技能要求', type: 'model', value: []},
        {title: '项目预算', type: 'inputNumber', value: '', subValue: ''},
        {title: '项目周期(预计周期)', type: 'select', value: ''},
        // {title: '技能LOGO', type: 'select', value: []},
    ])
    let [isModalVisibleA, setIsModalVisibleA] = useState(false);
    let [isModalVisibleB, setIsModalVisibleB] = useState(false);

    const skills = {
        title: '技能要求',
        subtitle: '你擅长的技能*(最多6个)',
        list: [
            {title: 'solidity', status: false},
            {title: 'javascript', status: false},
            {title: 'python', status: false},
            {title: 'Go', status: false},
            {title: 'C/C++', status: false},
            {title: 'Android', status: false},
            {title: 'HTML/CSS', status: false},
            {title: 'IOS', status: false},
        ]
    }

    const projectType = {
        title: '项目类型',
        subtitle: '项目相关类型*(最多6个)',
        list: [
            {title: 'solidity', status: false},
            {title: 'javascript', status: false},
            {title: 'python', status: false},
            {title: 'Go', status: false},
            {title: 'C/C++', status: false},
            {title: 'Android', status: false},
            {title: 'HTML/CSS', status: false},
            {title: 'IOS', status: false},
        ]
    }

    const selectAfter = (
        <Select
          defaultValue={1}
        >
          <Option value={1}>ETH</Option>
          <Option value={2}>BTC</Option>
        </Select>
    );

    const period = (
        <Select className="w100" defaultValue="预计周期">
          <Option value={3}>3天</Option>
          <Option value={7}>1周</Option>
          <Option value={21}>3周</Option>
          <Option value={30}>1个月</Option>
          <Option value={60}>2个月</Option>
        </Select>
    )

    const multiSelect = (index) => {
        
        return <div className="multiSelect" onClick={index === 3 ? showModalA : showModalB}>
                    {
                        inner[index].value.map((e,i) => 
                            <span key={i}>{e}</span>
                        )
                    }
                </div>
    }
    


    const print = (e,i) => {
        switch (e.type) {
            case 'input':
                return <Input className="inner" />;

            case 'textarea':
                return <TextArea className="inner h150"  />;

            case 'model':
            return multiSelect(i)

            case 'inputNumber':
            return <InputNumber className="inner w100" addonAfter={selectAfter} defaultValue={100} />;

            case 'select':
            return period

            default:
                break;
        }
    }

    const showModalA = () => {
        setIsModalVisibleA(true);
    };

    const showModalB = () => {
        setIsModalVisibleB(true);
    };

    const handleCancelA = () => {
        setIsModalVisibleA(false);
    };

    const handleCancelB = () => {
        setIsModalVisibleB(false);
    };

    return <div className="Publish">
        <div className="banner">
            <div className="banner-content">
                <p className="content-title">
                    发布你的项目需求
                </p>
                <p className="content-subtitle">
                    与技术精湛的开发者作为合作伙伴
                </p>
            </div>
        </div>
        <div className="container">
            {
                inner.map((e,i) => 
                    <div key={i} className="container-li">
                        <p className="li-title">{e.title}</p>
                        {print(e,i)}
                    </div>
                )
            }
            <Button type="primary" className="container-btn">确认发布</Button>
        </div>
        <div className="mb80"></div>

        <Modal className="modal" title={projectType.title} footer={null} visible={isModalVisibleA} onCancel={handleCancelA}>
            <p>{projectType.subtitle}</p>
            <div className="list">
                {
                    projectType.list.map((e,i) => 
                        <div key={i} className="li">
                            {e.title}
                        </div>
                    )
                }
            </div>
            <Button className="btn" type="primary">保存</Button>
        </Modal>

        <Modal 
            className="modal" 
            title={skills.title} 
            footer={null} 
            visible={isModalVisibleB} 
            onCancel={handleCancelB}
        >
            <p className="title">{skills.subtitle}</p>
            <div className="list">
                {
                    skills.list.map((e,i) => 
                        <div key={i} className="li">
                            {e.title}
                        </div>
                    )
                }
            </div>
            <Button className="btn" type="primary">保存</Button>
        </Modal>
    </div>
}