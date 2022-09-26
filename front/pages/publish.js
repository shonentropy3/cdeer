import { useEffect, useState } from "react"
import { Input, Select, InputNumber, Button, Modal, Upload, message } from 'antd';
import { FolderAddOutlined } from '@ant-design/icons';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router'
import { ethers } from "ethers";
const { TextArea } = Input;
const { Option } = Select;
// 自定义部分
import Modal_comfirmTask from "../components/Modal_comfirmTask";
import { useContracts } from '../controller/index';
import { createDemand, getHash } from "../http/api/task";
import { BitOperation } from '../utils/BitOperation';

export default function Publish() {
    
    const router = useRouter();
    const { address } = useAccount()
    const { useTaskContractWrite: Task } = useContracts('createTask');
    const [inner,setInner] = useState([
        {title: 'Entry Name', type: 'input', value: ''},
        {title: 'Project Description', type: 'textarea', value: ''},
        {title: '', type: 'upload', value: ''},
        {title: 'Project Type', type: 'model', value: [], subValue: []},
        {title: 'Skill Requirements', type: 'model', value: [], subValue: []},
        {title: 'Project Budget', type: 'inputNumber', value: '', subValue: 1},
        {title: 'Project Cycle', type: 'select', value: ''},
        // {title: '技能LOGO', type: 'select', value: []},
    ])
    let [isModalVisibleC, setIsModalVisibleC] = useState(false);
    let [data,setData] = useState({});
    let [fromdata,setFromdata] = useState();
    let [suffix,setSuffix] = useState("");
    let [skills,setSkills] = useState({
        title: '技能要求',
        subtitle: '你擅长的技能*(最多6个)',
        list: [
            {title: 'solidity', status: false, value: '101'},
            {title: 'javascript', status: false, value: '102'},
            {title: 'python', status: false, value: '103'},
            {title: 'Go', status: false, value: '104'},
            {title: 'C/C++', status: false, value: '105'},
            {title: 'Android', status: false, value: '106'},
            {title: 'HTML/CSS', status: false, value: '107'},
            {title: 'IOS', status: false, value: '108'},
        ]
    })
    let [projectType,setProjectType] = useState({
        title: '项目类型',
        subtitle: '项目相关类型*(最多6个)',
        list: [
            {title: 'solidity', status: false, value: '201'},
            {title: 'javascript', status: false, value: '202'},
            {title: 'python', status: false, value: '203'},
            {title: 'Go', status: false, value: '204'},
            {title: 'C/C++', status: false, value: '205'},
            {title: 'Android', status: false, value: '206'},
            {title: 'HTML/CSS', status: false, value: '207'},
            {title: 'IOS', status: false, value: '208'},
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
        console.log(info.file);
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
        let value = '';
        obj.list.map((ele,index) => {
            if (ele.status) {
                arr.push(index+1)
                value += ele.value + ','
            }
        })
        fun({...obj});
        inner[i].subValue = BitOperation(arr);
        inner[i].value = "'{"+ value.substring(0,value.lastIndexOf(',')) + "}'"
        setInner([...inner]);
    }

    const onchange = (e) => {
        inner[6].value = e;
        setInner([...inner]);
    }

    const comfirm = async() => {
        data = {
            title: inner[0].value,
            desc: inner[1].value,
            attachment: inner[2].value,
            currency: inner[5].subValue,
            budget: inner[5].value * 100,
            period: inner[6].value * 24 * 60 * 60,
            categories: inner[3].subValue,
            skills: inner[4].subValue,
        }
        let fee = {
            value: ethers.utils.parseEther("1")
        }
        if (fromdata) {
            await getHash(fromdata)
              .then((res) => {
                data.attachment = res
              })
              .catch(err => {
                console.log(err);
                return err
              })
        }
        setData({...data})
        Task.write({
            recklesslySetUnpreparedArgs: [address, data, fee]
        })
        console.log([address, data, fee]);
    }

    const writeSuccess = () => {
        let obj = {
            title: data.title,
            pro_content: data.desc,
            recruiting_role: inner[4].value,
            demand_type: inner[3].value,
            period: data.period,
            budget: data.budget,
            u_address: `${address}`,
            suffix: suffix,
            hash: data.attachment,
            payhash: Task.data.hash,
          }
        createDemand({"proLabel": JSON.stringify(obj)})
              .then(res => {
                if (res.code == '200') {
                  message.success('创建成功');
                  setTimeout(() => {
                    router.push('/')
                  }, 500);
                }else{
                  message.error('连接超时');
                }
              })
              .catch(err => {
                console.log(err);
                message.error('创建失败');
              })
      }

    useEffect(() => {
        console.log(Task.isSuccess);
        Task.isSuccess ? 
          writeSuccess()
          :
          ''
      },[Task.isSuccess])

    return <div className="Publish">
        <div className="h100"></div>
        <div className="banner">
            <div className="banner-content">
                <p className="content-title">
                Release your project requirements
                </p>
                <p className="content-subtitle">
                Become a partner with skilled developers
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
            <Button className="container-btn" onClick={showModalC}>发布需求</Button>
        </div>
        <div className="mb80"></div>
        <Modal
            className="Submit_item" 
            footer={null} 
            closable={false}
            open={isModalVisibleC} 
            onCancel={handleCancelC}
        >
            <Modal_comfirmTask comfirm={() => comfirm()}/>
        </Modal>
    </div>
}