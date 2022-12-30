import { useEffect, useState } from "react"
import { Input, Select, InputNumber, Button, Modal, Upload, message, Form, Spin, Checkbox } from 'antd';
import { useAccount, useProvider, useSigner } from 'wagmi';
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
import { createTask, getSillTreeMap } from "../http/_api/task";
import { getJwt } from "../utils/GetJwt";
import { GetSignature } from "../utils/GetSignature";
import SkillsCard from "../components/CustomCard/SkillsCard";
import {
    UploadOutlined
  } from '@ant-design/icons';

export default function Publish() {
    
    const { data: signer } = useSigner();
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
    let [skill,setSkill] = useState([]);
    // 可议价模式
    let [amountModel,setAmountModel] = useState(false);
    
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
        console.log('修改了 ==>');
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
        setFileList([...fileList])
    }

    const comfirm = async() => {
        var obj = _.omit(params,'role');
        let arr = [];
        skills.list.map(e => {
            arr.push(e.index);
        })
        obj.skills = BitOperation(arr)
        obj.currency = obj.currency === 'ETH' ? 1 : 1;
        obj.period = obj.period * 24 * 60 * 60;
        obj.budget = obj.budget === 0 ? obj.budget : ethers.utils.parseEther(`${obj.budget}`);
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
        setIsModalVisibleC(false); 
        setIsLoading(true)
        console.log(
            [address, obj, fee]
        );
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

    const changeAmount = (e) => {
        if (e.target.checked) {
            params.budget = 0;
        }
        setAmountModel(e.target.checked)
    }

    useEffect(() => {
        Task.data?.hash && writeSuccess()
    },[Task.data?.hash])

    useEffect(() => {
        Task.error && writeError()
    },[Task.error])

    useEffect(() => {
        // 获取技能树
        getSillTreeMap()
        .then(res => {
            console.log(res);
            if (res.code === 0) {
                skill = res.data;
                setSkill([...skill]);
            }
        })
    },[])

    const innerPrint = (e) => {
        switch (e.type) {
            case 'input':
                return <Input className="item-input" onChange={value => {e.value = value}} />
            case 'textarea':
                return <TextArea className="item-text" onChange={value => {e.value = value.target.value}} />
            case 'ul':
                return <SkillsCard stree={skill} value={skills} setValue={setSkills} />
            case 'inputNumber':
                if (amountModel) {
                    return
                }
                return <div className="item-num">
                            <InputNumber controls={false} addonAfter={selectAfter} onChange={(e)=>{params.budget = e}} />
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
                <Button>
                    <div className="img" >
                    <UploadOutlined />
                    </div>
                    <p>Upload Task requirement document（Word、Excel、PPT、PDF、image、video）<br/>maximum file size：20MB</p></Button>
              </Upload>
        }
    }

    const onFinish = (values) => {
        // 判断是否登陆 && 是否签名 && token有效期
        const token = localStorage.getItem(`session.${address?.toLowerCase()}`);
        if (!address) {
            setIsModalVisible(true)
            return
        }else if(!token || !getJwt(token)){
            // 获取签名
            GetSignature({address:address,signer:signer});
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
                                <div className="item-nav">
                                    {
                                        e.title && <p className="item-title">{e.title}</p>
                                    }
                                    {
                                        e.type === 'inputNumber' && 
                                        <Checkbox 
                                            checked={amountModel} 
                                            className="nav-box" 
                                            onChange={changeAmount}
                                        >由乙方报价</Checkbox>
                                    }
                                </div>
                                {
                                    e.type !== 'inputNumber' && e.type !== 'ul' && e.type !== 'select' && e.type !== 'upload' ? 
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
        {
            isModalVisible && 
            <ConnectModal 
                setStatus={setIsModalVisible} 
                status={isModalVisible} 
            />
        }
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
