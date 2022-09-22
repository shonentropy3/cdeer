import { useEffect, useState } from "react"
import { Steps, Pagination, Modal, InputNumber, Select, Button, message, } from "antd";
import { ClockCircleOutlined, MessageFilled, } from "@ant-design/icons"
import { useAccount } from 'wagmi'
import { createOrder, getMyApplylist, getMyDemand } from "../../http/api";
import { useContracts } from "../../controller/index";
import {useRouter} from "next/router"
import {Modal_ModifyTask} from "../../components/Modal_modifyTask"
import { ethers } from "ethers";



export default function applylist() {
    
    
    const { Option } = Select;
    const { Step } = Steps;
    const { address } = useAccount();
    const selectAfter = (
        <Select
          defaultValue="eth"
        >
          <Option value="eth">ETH</Option>
          <Option value="btc">BTC</Option>
        </Select>
      );
    let [taskId,setTaskId] = useState(null);
    let [data,setData] = useState([]);
    let [demandData,setDemandData] = useState({})
    let [worker,setWorker] = useState();
    let [amount,setAmount] = useState();
    let [allInfo,setAllInfo] = useState({})
    let [skills,setSkills] = useState({
        "101":"solidity",
        "102":"javascript",
        "103":"python",
        "104":"Go",
        "105":"C/C++",
        "106":"Android",
        "107":"HTML/CSS",
        "108":"IOS"
    });
    let [currencys,setCurrencys] = useState({
        1 : "ETH",
        2 : "BTC"
    })
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModifyModal,setIsModifyModal] = useState(false)
    const { useOrderContractWrite } = useContracts('createOrder');
    const router = useRouter()
      
    const showModal = () => {
      setIsModalOpen(true);
    };

    const showModifyModal = () => {
        setIsModifyModal(true)
    }
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };

    const ModifyHandler = () =>{
        setIsModifyModal(false)
    }

    const getInfo = ()=>{
        getMyDemand({hash: address})
        .then(res=>{
            let deData = {}
            res.map(e=>{
                if(e.id == taskId){
                    console.log(e);
                    deData = {
                        title: e.title,
                        desc: e.desc,
                        currency: e.apply_switch,
                        budget: e.budget,
                        period: e.period,
                        skill: e.role,
                        applyNum: data.length
                    }
                    setAllInfo({...e})
                    // console.log(deData);
                }
            })
            setDemandData({...deData})
        })
    }

    const getList = () => {
        getMyApplylist({demandId: taskId})
        .then(res => {
            // console.log(res);
            res.map(e => {
                e.address = e.apply_addr.slice(0,5) + "..." + e.apply_addr.slice(38,42)
            })
            data = res;
            setData([...data]);
        })
    }

    const invitation = () => {
        useOrderContractWrite.write({
            recklesslySetUnpreparedArgs: [
                Number(taskId),
                address,
                worker,
                ethers.constants.AddressZero,
                ethers.utils.parseEther(`${amount}`)
                
            ]
        })
    }

    const onchange = e => {
        amount = e;
        setAmount(amount);
    }

    const writeSuccess = () => {
        let obj = {
            hash: useOrderContractWrite.data.hash,
            address: address,
            taskId: taskId
        }
        createOrder(obj)
        .then(res => {
            if (res.code === 200) {
                message.success('操作成功!')
                setTimeout(() => {
                    history.go(0)
                }, 500);
            }
        })
    }

    // const routeHandler = ()=>{
    //     router.push("../publish")
    // }


    useEffect(() => {
        useOrderContractWrite.isSuccess ? 
            writeSuccess()
            :
            ''
    },[useOrderContractWrite.isSuccess])

    useEffect(() => {
        taskId !== null ? 
            getList()
            :
            ''
    },[taskId])

    useEffect(()=>{
        taskId !== null ?
        getInfo()
        :
        ""
    },[demandData.applyNum])

    useEffect(() => {
        console.log(useOrderContractWrite.error);
    },[useOrderContractWrite.error])

    useEffect(() => {
        taskId = location.search.slice('?')[1];
        setTaskId(taskId);
    },[])

    return <div className="Applylist">
        <div className="task-info">
            <div className="task-demand">
                <p className="task-title">{demandData.title}</p>
                <p className="task-skill">技术要求:
                    {
                        demandData.skill?.map((e,i)=>e?(<span key={i}>{skills[e]}</span>):"")
                    }
                </p>
                <p className="task-cycle">项目周期:
                    <span>{parseInt(demandData.period/86400)}天</span>
                    项目预算:
                    <span>{demandData.budget}{currencys[demandData.currency]}</span>
                </p>
            </div>
            <div className="task-changeInfo" onClick={showModifyModal}>修改信息</div>
            <div className="apply-number">
                <p className="a-number">{demandData.applyNum}</p>
                <p>报名人数</p>
            </div>
        </div>
        <div className="product-stage">
            <Steps size="small" current={1}>
                <Step title="发布" />
                <Step title="报名中" />
                <Step title="阶段划分" />
                <Step title="开发中" />
                <Step title="完成" />
            </Steps>
        </div>
        <div className="task-list">
            <h4>报名列表</h4>
            <div className="product-list">
                <ul>
                    {
                        data.map((e,i) => <li key={i}>
                            <div className="product-list-item">
                                <div className="product-img"></div>
                                <div className="product-info">
                                    <p className="applicant-name">{e.address}</p>
                                    <p className="applicant-skill">擅长技能：
                                        <span>solidity、</span>
                                        <span>php、</span>
                                        <span>javascripts</span>
                                    </p>
                                    <p className="applicant-info">
                                        <span>查看他的信息</span>
                                        <span>查看他的报名资料</span>
                                    </p>
                                    <p className="applicant-mess">
                                        <span className="applicant-mess-item"><MessageFilled />联系方式</span>
                                        <span className="applicant-mess-item"><MessageFilled />联系方式</span>
                                    </p>
                                </div>
                                <div className="product-apply">
                                    <p className="product-apply-price">{e.price} ETH</p>
                                    <p className="product-apply-he">他的报价</p>
                                    <p className="product-apply-time">
                                        <span><ClockCircleOutlined /></span>
                                        <span className="product-apply-time-text">30分钟前报名</span>
                                    </p>
                                </div>
                            </div>
                            <div>
                                <div className="product-collaborate">
                                    <p className="product-collaborate-no">暂不合作</p>
                                    <p onClick={() => {worker = e.apply_addr, setWorker(worker) ,showModal()}}>邀请合作</p>
                                </div>
                            </div>
                        </li> )
                    }
                </ul>
            </div>
            <div className="task-page">
                <Pagination defaultCurrent={1} total={50} />
            </div>
        </div>
        <Modal title="选择接单者" open={isModalOpen} footer={null} onCancel={handleCancel}>
            给出您的预算
            <InputNumber addonAfter={selectAfter} onChange={onchange} />
            <Button className="btn" type="primary" onClick={() => invitation()}>邀请合作</Button>
        </Modal>
        <Modal 
            footer={null}
            title="修改订单" 
            open={isModifyModal} 
            bodyStyle={{height:900}}
            onCancel={ModifyHandler}>
            <Modal_ModifyTask allInfo={allInfo} taskId={taskId} />
        </Modal>
    </div>
}