import { useEffect, useState } from "react"
import { Input, Select, InputNumber, Button, Modal, Upload, message, Form, Spin } from 'antd';
import { useAccount, useProvider } from 'wagmi';
import { useRouter } from 'next/router'
import { ethers } from "ethers";
const { TextArea } = Input;
const { Option } = Select;
// 自定义部分
import { useContracts } from '../controller/index';
import { BitOperation } from '../utils/BitOperation';
import { uploadProps } from "../components/upload/config";
import ConnectModal from "../components/CustomModal/ConnectModal";
import ComfirmTaskModal from "../components/CustomModal/ComfirmTaskModal";
import { omit } from 'lodash';
import { createTask } from "../http/_api/task";
import { getJwt } from "../utils/GetJwt";

export default function Publish() {
    
    const _data = require("../data/data.json");
    const router = useRouter();
    const { address } = useAccount();
    const { useTaskContractWrite: Task } = useContracts('createTask');

    // getTransaction
    // const waitForTransaction = useWaitForTransaction({
    //     hash: Task.data?.hash,
    // })
    const provider = useProvider();
    let [isLoading, setIsLoading] = useState()
    // 遮罩层显示
    let [showSpin,setShowSpin] = useState(false)

    const [inner,setInner] = useState([
        {title: 'Entry Name', type: 'input', desc: '项目名称', name: 'title'},
        {title: 'Task Description', type: 'textarea', desc: '项目描述', name: 'desc'},
        {type: 'upload', desc: '项目附件', name: 'attachment'},
        {title: 'Skill Requirements', type: 'ul', desc: '项目要求', name: 'role'},
        {title: 'Task Budget', type: 'inputNumber', desc: '预计金额', name: 'budget'},
        {title: 'Task Cycle', type: 'select', desc: '预计周期', name: 'period'},
        // {title: 'LOGO（Optional）', type: 'select', desc: '', name: ''},
    ])
    let [params, setParams] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleC, setIsModalVisibleC] = useState(false);
    let [fileList, setFileList] = useState([]);
    let [skills,setSkills] = useState({
        title: '技能要求',
        subtitle: '你擅长的技能*(最多4个)',
        list: []
    })

    const selectAfter = (
        <Form.Item name="currency" noStyle>
        <Select>
          <Option value="ETH">ETH</Option>
          <Option value="BTC">BTC</Option>
        </Select>
        </Form.Item>
    );

    const period = (
        <Form.Item name="period" noStyle rules={[{
            required: true,
            message: `未选择预计周期`,
        }]}>
        <Select>
          <Option value={3}>3天</Option>
          <Option value={7}>1周</Option>
          <Option value={21}>3周</Option>
          <Option value={30}>1个月</Option>
          <Option value={60}>2个月</Option>
        </Select>
        </Form.Item>
    )



    const handleChange = (info, list) => {
        params.suffix = info.file.name;
        fileList = info.fileList;
        setFileList([...fileList]);
    }
    
    const uploadSuccess = (res, file) => {
        if (res.code === 0) {
            message.success(res.msg);
            fileList[0].status = "success";
        } else {
            message.error(res.msg);
            fileList[0].status = "error";
        }
        if (res.code !== 7) {
            params.attachment = res.data.hash;
        }
    }

    const changeSelect = (obj, i) => {
        if (limiter(obj.list, i) === false) {
            message.error('最多可选择4个')
            return
        }
        obj.list[i].status = !obj.list[i].status
        skills.list[i] = obj.list[i]
        setSkills({...skills})
        set(obj)
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

    const set = (obj) => {
        let arr = [];
        let role = [];
        obj.list.map((ele,index) => {
            if (ele.status) {
                arr.push(index+1)
                role.push(ele.value)
            }
        })
        params.skills = BitOperation(arr);
        params.role = role;
    }
    
    const comfirm = async() => {
        var obj = _.omit(params,'role');
        obj.currency = obj.currency === 'ETH' ? 1 : 1;
        obj.period = obj.period * 24 * 60 * 60;
        obj.budget = ethers.utils.parseEther(obj.budget);
        obj.attachment = obj.attachment ? obj.attachment : '';
        obj.timestamp = 0;
        obj.disabled = false;
        let fee = { value: ethers.utils.parseEther("0") };
        /**
         *  title: task.title,
            desc: task.desc,
            attachment: task.attachment,
            currency: task.currency,
            budget: task.budget,
            period: task.period,
         *  skills: task.skills,
         */
        // 判断token有效期
        const token = localStorage.getItem(`session.${address.toLowerCase()}`);
        let status = getJwt(token);
        if (!status) {
            await getToken();
        }
        setIsModalVisibleC(false); 
        setIsLoading(true)
        Task.write({
            recklesslySetUnpreparedArgs: [address, obj, fee]
        })
    }

    const writeSuccess = async() => {
        var obj = {};
        obj.hash = Task.data.hash;
        obj.suffix = params.suffix ? params.suffix : '';
        await createTask(obj)
        .then(res => {
            if (res.code === 0) {
                // message.success(res.msg);
                // setTimeout(() => {
                //     router.push({pathname: '/task', search: 'issuer'})    //  跳转链接
                // }, 500);

                setIsLoading(false)
                setShowSpin(true)
            } else {
                message.error(res.msg);
            }
        })

        // 判断交易是否成功上链
        await provider.getTransaction(Task.data.hash)
        .then(res => {
          message.success('交易成功');
          setTimeout(() => {
              router.push(`/task?w=issuer&bar=tasks`)    //  跳转链接
          }, 500);
        })
        .catch(err => {
          message.error('交易失败')
        })
    }

    const writeError = () => {
        setIsLoading(false)
        message.error('交易失败')
    }

    useEffect(() => {
        Task.data?.hash && writeSuccess()
    },[Task.data?.hash])

    useEffect(() => {
        Task.error && writeError()
    },[Task.error])

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


    const innerPrint = (e) => {
        switch (e.type) {
            case 'input':
                return <Input className="item-input" onChange={value => {e.value = value}} />
            case 'textarea':
                return <TextArea className="item-text" onChange={value => {e.value = value.target.value}} />
            case 'ul':
                return <div className="item-ul">{
                        skills.list.map((e,i) => 
                            <div key={i} className={`li ${e.status ? 'active':''}`} onClick={() => changeSelect(skills,i)}>
                                {e.title}
                            </div>)}
                    </div>
            case 'inputNumber':
                return <div className="item-num">
                            <InputNumber controls={false} addonAfter={selectAfter} />
                        </div>
            case 'select': 
                return <div className="item-select">
                            {period}
                        </div>
            default:
                return <Upload
                            listType="picture"
                            onChange={handleChange}
                            onSuccess={uploadSuccess}
                            className="item-upload"
                            {...uploadProps}
                            fileList={fileList}
                            progress={{
                                strokeColor: {
                                  '0%': '#108ee9',
                                  '100%': '#87d068',
                                },
                                strokeWidth: 3,
                                format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
                            }}
                        >
                <Button><div className="img" /><p>Upload Task requirement document（Word、Excel、PPT、PDF、image、video）<br/>maximum file size：20MB</p></Button>
              </Upload>
        }
    }

    const onFinish = (values) => {
        // 判断是否登陆
        if (!address) {
            setIsModalVisible(true)
            return
        }
        params = {...values, ...params}
        setParams({...params});
        setIsModalVisibleC(true)
    };

    return <div className="Publish">
        <Spin tip={'加载中'} spinning={showSpin}>
        <div className="banner">
            <div className="banner-content">
                <p className="title">Release your Task requirements</p>
                <p className="subtitle">Become a partner with skilled developers</p>
            </div>
        </div>
        <div className="content">
            <div className="content-panel">
            <Form
                name="complex-form"
                onFinish={onFinish}
                initialValues={{
                    currency: 'ETH'
                }}
            >
                {
                    inner.map((e,i) => 
                        
                            <div className="item" key={i}>
                                {
                                    e.title && <p className="item-title">{e.title}</p>
                                }
                                {
                                    e.type !== 'ul' && e.type !== 'select' && e.type !== 'upload' ? 
                                    <Form.Item name={e.name} 
                                        rules={[{
                                            required: true,
                                            message: `${e.desc}未输入`,
                                        }]}
                                    >
                                        {innerPrint(e)}
                                    </Form.Item>
                                    :
                                    innerPrint(e)
                                }
                            </div>
                        // </Form.Item>
                    )
                }
                <Form.Item className="item-poa">
                    <Button type="primary" htmlType="submit" className="panel-btn" loading={isLoading} >
                        Release
                    </Button>
                </Form.Item>
            </Form>
            </div>
        </div>
        </Spin>
        <ConnectModal setStatus={setIsModalVisible} status={isModalVisible} />
        
        <Modal
            className="Submit_item" 
            footer={null} 
            closable={false}
            open={isModalVisibleC} 
            onCancel={() => setIsModalVisibleC(false)}
        >
            <ComfirmTaskModal inner={params} skills={skills} comfirm={() => comfirm()} setStatus={setIsModalVisibleC} />
        </Modal>
    </div>
}
