import { useState } from "react"
import { 
    Input, 
    Select, 
    InputNumber, 
    Button, 
    Modal, 
    Upload, 
    message 
} from 'antd';
const { TextArea } = Input;
const { Option } = Select;
import {
    FolderAddOutlined
  } from '@ant-design/icons';
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
    let [isModalVisibleC, setIsModalVisibleC] = useState(false);
    let [fromdata,setFromdata] = useState();
    let [suffix,setSuffix] = useState("");

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
                return <Upload
                            listType="picture"
                            maxCount={1}
                            name="file"
                            onChange={handleChange}
                            customRequest={upload}
                        >
                <Button icon={<FolderAddOutlined />}>上传项目需求文档（Word、Excel、PPT、PDF、图像、视频，20MB以内）</Button>
              </Upload>
                // <FolderAddOutlined />
        }
    }

    const upload = async(info) => {
        // info.onProgress()
        var formData=new FormData();
        formData.append('files',info.file);
        fromdata = formData
        setFromdata(fromdata)
        return await new Promise ((resolve,reject)=>{
          resolve(beforeUpload(info))
       })
       .then((res)=>{
          res ? info.onSuccess() : info.onError()
       })
    }

    const handleChange = (info) => {
        suffix = info.file.name;
        setSuffix(suffix);
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          } 
    }
    
    const beforeUpload = (info) => {
        const isLt2M = info.file.size / 1024 / 1024 < 20;
        if (!isLt2M) {
          message.error('Must smaller than 20MB!');
          return false
        }
        return true
    };

    const showModalA = () => {
        setIsModalVisibleA(true);
    };

    const showModalB = () => {
        setIsModalVisibleB(true);
    };

    const showModalC = () => {
        setIsModalVisibleC(true);
    };

    const handleCancelA = () => {
        setIsModalVisibleA(false);
    };

    const handleCancelB = () => {
        setIsModalVisibleB(false);
    };

    const handleCancelC = () => {
        setIsModalVisibleC(false);
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
            <Button type="primary" className="container-btn" onClick={showModalC}>确认发布</Button>
        </div>
        <div className="mb80"></div>

        <Modal 
            className="modal" 
            title={projectType.title} 
            footer={null} 
            visible={isModalVisibleA} 
            onCancel={handleCancelA}
        >
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
        <Modal
            className="modal-submit" 
            footer={null} 
            closable={false}
            visible={isModalVisibleC} 
            onCancel={handleCancelC}
        >
            <p className="modal-title"> 确认发布项目 </p>
            <div className="modal-info">
                <div className="info-full">
                    <p className="title">项目详情</p>
                    <div className="content">XDAO运维+数据系统开发</div>
                </div>
                <div className="info-full">
                    <p className="title">项目类型</p>
                    <div className="content">区块链</div>
                </div>
                <div className="info-full info-half">
                    <div>
                        <p className="title">项目预算</p>
                        <div className="content">10 ETH</div>
                    </div>
                    <div>
                        <p className="title">项目周期</p>
                        <div className="content">20天</div>
                    </div>
                </div>
                <div className="info-full">
                    <p className="title">项目描述</p>
                    <div className="content">后台需要一套前端系统来支持数据维护，权限维护，爬虫任务状态控制等工作。后台需要一套前端系统来支持数据维护，权限维护，爬虫任务状态控制等工作。后台需要一套前端系统来支持数据维护，权限维护，爬虫任务状态控制等工作。</div>
                </div>
                <div className="info-full">
                    <p className="title">项目文档</p>
                    <div className="content">xxxx</div>
                </div>
                <div className="info-full">
                    <p className="title">技能要求</p>
                    <div className="content"></div>
                </div>
                <Button className="btn" type="primary">确认发布</Button>
            </div>
        </Modal>
    </div>
}