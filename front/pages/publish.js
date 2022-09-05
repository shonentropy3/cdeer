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
import { FolderAddOutlined } from '@ant-design/icons';

import { BitOperation } from '../utils/BitOperation';

const { TextArea } = Input;
const { Option } = Select;

export default function Publish() {

    const [inner,setInner] = useState([
        {title: '项目名称', type: 'input', value: ''},
        {title: '项目描述', type: 'textarea', value: ''},
        {title: '', type: 'upload', value: ''},
        {title: '项目类型', type: 'model', value: []},
        {title: '技能要求', type: 'model', value: []},
        {title: '项目预算', type: 'inputNumber', value: '', subValue: 1},
        {title: '项目周期(预计周期)', type: 'select', value: ''},
        // {title: '技能LOGO', type: 'select', value: []},
    ])
    let [isModalVisibleC, setIsModalVisibleC] = useState(false);
    let [fromdata,setFromdata] = useState();
    let [suffix,setSuffix] = useState("");
    let [skills,setSkills] = useState({
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
    })
    let [projectType,setProjectType] = useState({
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
    })

    const selectAfter = (
        <Select
          defaultValue={1}
          onChange={(e) => changeSel(e)}
        >
          <Option value={1}>ETH</Option>
          <Option value={2}>BTC</Option>
        </Select>
    );

    const period = (
        <Select className="w100" defaultValue="预计周期" onChange={(e) => onchange(e)}>
          <Option value={3}>3天</Option>
          <Option value={7}>1周</Option>
          <Option value={21}>3周</Option>
          <Option value={30}>1个月</Option>
          <Option value={60}>2个月</Option>
        </Select>
    )

    const multiSelect = (index) => {

        return (
            <div className="multiSelect">
                <div className="list">
                    {
                        index === 3 ? 
                            projectType.list.map((e,i) => 
                                <div key={i} className={`li ${e.status ? 'active':''}`} onClick={() => changeSelect(projectType,i,3)}>
                                    {e.title}
                                </div>
                            )
                            :
                            skills.list.map((e,i) => 
                                <div key={i} className={`li ${e.status ? 'active':''}`} onClick={() => changeSelect(skills,i,4)}>
                                    {e.title}
                                </div>
                            )
                    }
                </div>
            </div>
    )}

    const print = (e,i) => {
        switch (e.type) {
            case 'input':
                return <Input className="inner" onChange={(ele)=>changeStr(ele,i)} />;

            case 'textarea':
                return <TextArea className="inner h150" onChange={(ele)=>changeStr(ele,i)} />;

            case 'model':
            return multiSelect(i)

            case 'inputNumber':
            return <InputNumber className="inner w100" onChange={changeNum} addonAfter={selectAfter} />;

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

    const showModalC = () => {
        setIsModalVisibleC(true);
    };

    const handleCancelC = () => {
        setIsModalVisibleC(false);
    };

    // 获取数据
    const changeStr = (e,i) => {
        inner[i].value = e.target.value;
        setInner([...inner])
    }

    const changeNum = (e) => {
        inner[5].value = e;
        setInner([...inner]);
    }

    const changeSel = (e) => {
        inner[5].subValue = e;
        setInner([...inner]);
    }

    const changeSelect = (obj, i, index) => {
        if (limiter(obj.list, i) === false) {
            message.error('最多可选择6个')
            return
        }
        obj.list[i].status = !obj.list[i].status

        obj.title === "项目类型" ? 
            set(setProjectType, obj, index)
            :
            set(setSkills, obj, index)
    }

    const limiter = (arr,i) => {
        let length = 0;
        arr.map(e => {
            e.status ? length++ : '';
        })
        if (length === 6 && !arr[i].status) {
            return false
        }
    }

    const set = (fun, obj, i) => {
        let arr = [];
        obj.list.map((ele,index) => {
            if (ele.status) {
                arr.push(index+1)
            }
        })
        fun({...obj});
        inner[i].value = BitOperation(arr);
        setInner([...inner]);
    }

    const onchange = (e) => {
        inner[6].value = e;
        setInner([...inner]);
    }

    const comfirm = () => {

        console.log(inner);
    }

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
            className="Submit_item" 
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
                <Button className="btn" type="primary" onClick={() => comfirm()}>确认发布</Button>
            </div>
        </Modal>
    </div>
}