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
    
    const _data = require("../data/data.json");
    const router = useRouter();
    const { address } = useAccount()
    const { useTaskContractWrite: Task } = useContracts('createTask');
    const [inner,setInner] = useState([
        {title: 'Entry Name', type: 'input', value: '', style:false },
        {title: 'Project Description', type: 'textarea', value: '', style:false },
        {title: '', type: 'upload', value: '', style:false },
        {title: 'Skill Requirements', type: 'model', value: [], subValue: [], style:false },
        {title: 'Project Budget', type: 'inputNumber', value: '', subValue: 1, style:false },
        {title: 'Project Cycle', type: 'select', value: '', style:false },
        // {title: '技能LOGO', type: 'select', value: []},
    ])
    let [isModalVisibleC, setIsModalVisibleC] = useState(false);
    let [flag, setFlag] = useState(false);
    let [data,setData] = useState({});
    let [fromdata,setFromdata] = useState();
    let [progress,setProgress] = useState();
    let [suffix,setSuffix] = useState("");
    let [skills,setSkills] = useState({
        title: '技能要求',
        subtitle: '你擅长的技能*(最多4个)',
        list: []
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
        <Select className={["w100",inner[5].style?"err":""].join(' ')} defaultValue="预计周期" onChange={(e) => onchange(e)}>
          <Option value={3}>3天</Option>
          <Option value={7}>1周</Option>
          <Option value={21}>3周</Option>
          <Option value={30}>1个月</Option>
          <Option value={60}>2个月</Option>
        </Select>
    )

    const multiSelect = () => {

        return (
            <div className="multiSelect">
                <div className="list">
                    {
                        skills.list.map((e,i) => 
                            <div key={i} className={`li ${e.status ? 'active':''}`} onClick={() => changeSelect(skills,i,3)}>
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
                return <Input className={[e.style?"err":"inner"].join('')} onChange={(ele)=>changeStr(ele,i)} />;

            case 'textarea':
                return <TextArea className={["h150",e.style?"err":"inner"].join(' ')} onChange={(ele)=>changeStr(ele,i)} />;

            case 'model':
            return multiSelect(i)

            case 'inputNumber':
            return <InputNumber className={["w100","eth-select",e.style?"err":"inner"].join(' ')} onChange={changeNum} controls={false} addonAfter={selectAfter} />;

            case 'select':
            return period

            default:
                return <Upload
                            // listType="picture"
                            maxCount={1}
                            name="file"
                            onChange={handleChange}
                            // className="upload-button"
                            customRequest={upload}
                            progress={{
                                strokeColor: {
                                  '0%': '#108ee9',
                                  '100%': '#87d068',
                                },
                                strokeWidth: 3,
                                format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
                              }}
                        >
                <Button icon={<FolderAddOutlined />}>上传项目需求文档（Word、Excel、PPT、PDF、图像、视频，20MB以内）</Button>
              </Upload>
                // <FolderAddOutlined />
        }
    }
    const upload = async(info) => {
        var formData=new FormData();
        formData.append('files',info.file);
        fromdata = formData
        setFromdata(fromdata)
        
        return await new Promise ((resolve,reject)=>{
          resolve(beforeUpload(info))
       })
       .then((res)=>{
            if (res) {
                info.onSuccess()
                info.onProgress({percent: 100})
            }else{
                info.onError()
            }
       })
    }

    const handleChange = (info, list) => {
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
        //  TODO: 钱包状态判断
        if (!address) {
            console.log('hh');
            // TODO: connect wallet
            return
        }
        let isAllInfo = true
        let nullNum = 0
        inner.map(e => {
            if(e.type == 'upload') {

            }else if (e.type == 'model'){
                if (e.value[0] == undefined){
                    nullNum += 1
                }
                if (e.value[2] == '}'){
                    nullNum += 1
                }
                // e.value==[] ? nullNum += 1 : e.style = false 
                setInner([...inner])
            }else if (e.type == 'select') {
                if (!e.value) {
                    nullNum += 1;
                    e.style = true
                    setInner([...inner])
                }
            }
            else{
                if(!e.value){
                    nullNum += 1
                    e.style=true
                    setInner([...inner])
                }
            }
        })
        nullNum === 0 ? isAllInfo = true : isAllInfo = false
        isAllInfo?setIsModalVisibleC(true):message.error('请填写必填信息')
    };

    const handleCancelC = () => {
        setIsModalVisibleC(false);
    };

    // 获取数据
    const changeStr = (e,i) => {
        inner[i].value = e.target.value;
        inner[i].style = false
        setInner([...inner])
    }

    const changeNum = (e) => {
        inner[4].value = e;
        inner[4].style = false
        setInner([...inner]);
    }

    const changeSel = (e) => {
        inner[4].subValue = e;
        setInner([...inner]);
    }

    const changeSelect = (obj, i, index) => {
        if (limiter(obj.list, i) === false) {
            message.error('最多可选择4个')
            return
        }
        console.log(index);
        obj.list[i].status = !obj.list[i].status
        skills.list[i] = obj.list[i]
        setSkills({...skills})
        set(setSkills, obj, index)
    }

    const limiter = (arr,i) => {
        let length = 0;
        arr.map(e => {
            e.status ? length++ : '';
        })
        if (length === 4 && !arr[i].status) {
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
        inner[5].value = e;
        inner[5].style = false
        setInner([...inner]);
    }
    
    const comfirm = async() => {
        // TODO: 币种处理 ==> 2、3
        let budget = inner[4].subValue === 1 ? ethers.utils.parseEther(`${inner[4].value}`) : 1;
        data = {
            title: inner[0].value,
            desc: inner[1].value,
            attachment: inner[2].value,
            currency: inner[4].subValue,
            budget: budget,
            period: inner[5].value * 24 * 60 * 60,
            skills: inner[3].subValue,
        }
        let fee = { value: ethers.utils.parseEther("0") };
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
    }

    const writeSuccess = () => {
        let obj = {
            title: data.title,
            pro_content: data.desc,
            recruiting_role: inner[3].value,
            period: data.period,
            budget: data.budget / 100 * Math.pow(10,18),          //  Currency: 1: ETH 10^18
            u_address: `${address}`,
            suffix: suffix,
            hash: data.attachment,
            payhash: Task.data.hash,
          }
        createDemand({"proLabel": JSON.stringify(obj)})
              .then(res => {
                if (res.code == 'SUCCESS') {
                  message.success('创建成功');
                  setTimeout(() => {
                    router.push({pathname: '/task', search: 'issuer'})    //  跳转链接
                  }, 500);
                }else{
                  message.error('创建失败');
                }
              })
              .catch(err => {
                console.log(err);
                message.error('创建失败');
              })
      }

    useEffect(() => {
        Task.isSuccess ? 
          writeSuccess()
          :
          ''
      },[Task.isSuccess])

    useEffect(() => {
        let arr = [];
        _data.skills.map((e,i) => {
            if (i > 0) {
                arr.push({
                    title: e.name, status: false, value: e.value
                })
            }
        })
        skills.list = arr;
        setSkills({...skills});
    },[])

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
            <Modal_comfirmTask inner={inner} skills={skills} comfirm={() => comfirm()}/>
        </Modal>
    </div>
}