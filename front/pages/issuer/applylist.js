import { useEffect, useState } from "react"
import { Steps, Pagination, Modal, InputNumber, Select, Button, message, } from "antd";
import { ClockCircleOutlined, MessageFilled, } from "@ant-design/icons"
import { useAccount } from 'wagmi'
import { getMyApplylist, getMyInfo } from "../../http/api/user";
import { createOrder } from "../../http/api/order";
import { useContracts } from "../../controller/index";
import { Modal_ModifyTask } from "../../components/Modal_modifyTask"
import { ethers } from "ethers";
import { getTasksData,delDemand,modifyApplySwitch } from "../../http/api/user";
import { modifyApplySort } from "../../http/api/apply";



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
    const [info, setInfo] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModifyModal,setIsModifyModal] = useState(false)
    const [isModalDetial,setIsModalDetial] = useState(false)
    const { useOrderContractWrite } = useContracts('createOrder');
      
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
        getTasksData({hash: address})
        .then(res=>{
            let deData = {}
            res.map(e=>{
                if(e.id == taskId){
                    // 币种换算
                    let budeget = e.budget / Math.pow(10,18);
                    deData = {
                        title: e.title,
                        desc: e.desc,
                        currency: 1,   // TODO: 从链上获取
                        budget: budeget,
                        period: e.period,
                        skill: e.role,
                        applyNum: data.length,
                        apply_switch: e.apply_switch
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
            for (const i in res) {
                res[i].map(e => {
                    e.address = e.apply_addr.slice(0,5) + "..." + e.apply_addr.slice(38,42)
                    // 币种换算处理
                    // if (e.currency === 1) {
                        e.price = e.price / Math.pow(10,18)
                    // }
                })
            }
            let arr = res.normal.concat(res.sort);
            data = arr;
            console.log(arr);
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

    // 删除任务
    const deleteTask = () => {
        let data = {id:taskId}
        delDemand(data)
        .then((res)=>{
            console.log(res);
            message.success("任务已删除")
        })
        .catch((error)=> {
            console.log(error);
            message.error("服务器错误")
        })
    }

    // 报名开关
    const applyHandler = () => {
        let buttonSwitch
        let data
        if(allInfo.apply_switch == 1){
            data = { demandId: taskId,buttonSwitch:0 }
            modifyApplySwitch(data)
            .then((res)=>{
                console.log(res);
                message.success("报名已关闭")
                allInfo.apply_switch = 0
                setAllInfo({...allInfo})
            })
        }else{
            data = { demandId: taskId, buttonSwitch: 1 }
            modifyApplySwitch(data)
            .then((res)=>{
                console.log(res);
                message.success("报名已开启")
                allInfo.apply_switch = 1
                setAllInfo({...allInfo})
            })
        }
        console.log(allInfo.apply_switch);
    }

    // 暂不合作
    const sort = (e, i) => {
        data[i].sort = 0;
        setData([...data]);
        let obj = {
            address: e,
            taskId: taskId
        }
        modifyApplySort({proLabel: JSON.stringify(obj)})
        .then(res => {
            message.success('操作成功')
        })
    }

    const detailCancel = () => {
        setIsModalDetial(false)
    };

    const showDetailModal = (e) => {
        setIsModalDetial(true);
        getMyInfo({address: e.apply_addr})
        .then(res => {
            info = {
                address: e.apply_addr.slice(0,5) + "..." + e.apply_addr.slice(38,42),
                amount: e.price,
                name: '',
                desc: e.desc
            }
            if (res.code === 200 && res.data.length > 0) {
                info.name = res.data.username;
            }
            setInfo({...info});
        })
        .catch(err => {
            console.log(err);
        })
    };

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
                    <span>{demandData.budget}ETH</span>
                </p>
            </div>
            <div className="task-changeInfo" onClick={showModifyModal}>修改信息</div>
            <div className="task-delete" onClick={deleteTask}>删除任务</div>
            <div className="task-apply-switch" onClick={applyHandler}>{allInfo.apply_switch?"关闭报名":"开启报名"}</div>
            <div className="apply-number">
                <p className="a-number">{demandData.applyNum}</p>
                <p>报名人数</p>
            </div>
        </div>
        <div className="product-stage">
            {/* <Steps size="small" current={1}>
                <Step title="发布" />
                <Step title="报名中" />
                <Step title="阶段划分" />
                <Step title="开发中" />
                <Step title="完成" />
            </Steps> */}
        </div>
        <div className="task-list">
            <h4>报名列表</h4>
            <div className="product-list">
                <ul>
                    {
                        data.map((e,i) => <li key={i} className={e.sort === 0 ? 'sort':''} >
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
                                        <span onClick={() => showDetailModal(e)}>查看他的报名资料</span>
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
                                    <p onClick={() => sort(e.apply_addr, i)} className="product-collaborate-no">暂不合作</p>
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
        <Modal title="" open={isModalDetial} onCancel={detailCancel} footer={null}>
            <p className="title">报名信息</p>
            <p className="subtitle">报名者「{info.name ? info.name : info.address}」的报价</p>
            <p>{info.amount}ETH</p>
            <p className="subtitle">报价者「{info.name ? info.name : info.address}」的自我介绍</p>
            <div> {info.desc} </div>
      </Modal>
    </div>
}