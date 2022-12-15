import { useEffect, useState } from "react"
import { Modal, InputNumber, Select, Button, message, } from "antd";
import { ClockCircleOutlined, DoubleRightOutlined } from "@ant-design/icons"
import { useAccount } from 'wagmi'
import { getMyApplylist, getMyInfo } from "../../http/api/user";
import { createOrder } from "../../http/api/order";
import { useContracts } from "../../controller/index";
import { Modal_ModifyTask } from "../../components/Modal_modifyTask"
import Computing_time from "../../components/Computing_time";
import { ethers } from "ethers";
import { getTasksData,delDemand,modifyApplySwitch, getApplicationInfo } from "../../http/api/user";
import { modifyApplySort } from "../../http/api/apply";
import Image from "next/image";



export default function Applylist() {
    
    const { Option } = Select;
    const { address, isConnected } = useAccount();
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
    let [wagmi,setWagmi] = useState({})
    // 记录报名者的个人信息
    let [applicantInfo,setApplicantInfo] = useState()
    // 记录用户查看的报名者的钱包地址
    let [seeAddr,setSeeAddr] = useState()
    // 记录用户未设置用户名时显示的缩写地址
    let [nameAddr,setNameAddr] = useState()

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
    const [isInfoModal,setIsInfoModal] = useState(false)
    const { useOrderContractWrite, Config } = useContracts('createOrder');
      
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

    // 设置当前查看的报名者
    const seeHim = (addr,name) => {
        seeAddr = addr
        nameAddr = name
        setSeeAddr(addr)
        setNameAddr(nameAddr)
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
            console.log(res);
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
            setData([...data]);
            console.log(data);
        })
    }

    // 获取报名人员信息
    const getApplyListInfo = () => {
        let applyPerson = []
        data.map((e)=>{ 
            applyPerson.push(e.apply_addr)
        })
        getApplicationInfo({address: applyPerson})
        .then((res)=>{
            applicantInfo = res;
            setApplicantInfo([...applicantInfo])
        })
    }

    const invitation = () => {
        console.log(Number(taskId),address,worker,ethers.constants.AddressZero,ethers.utils.parseEther(`${amount}`));
        console.log(Config);
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
        // TODO: 点击直接下去
        // console.log(data);
        // data.map((ele,index) => {
        //     if (index === i) {
        //         data.unshift(data.splice(index , 1)[0]);
        //     }
        // })
        // console.log(data);
        // return
        data[i].sort = 0;
        setData([...data]);
        let obj = {
            address: e,
            taskId: taskId
        }
        modifyApplySort({proLabel: JSON.stringify(obj)})
        .then(res => {
            message.success('操作成功')

            data.splice(i,1);
            setData([...data])
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

    // 展示报名者的技能
    const showSkills = (apply_addr) => {
        return applicantInfo?.map((e,i)=>{
            if ( e.address === apply_addr && e.role) {
                return e.role.map((ele,index) => {
                    return <span key={index}>{ele}</span>
                })
            }else if ( e.address === apply_addr && !e.role ) {
                return <span key={i}>null</span>
            }
        })
    }

    // 展示报名者的头像
    const showAvatar = (apply_addr) => {
        return applicantInfo?.map((e,i)=>{
            if (e.address === apply_addr && e.avatar) {
                return <img key={i} src={e.avatar} />
            }else if (e.address === apply_addr && !e.avatar) {
                return <img key={i} src={hashAvt(e.address)} />
            }
        })
    }

    //弹窗显示报名者的详细信息
    const showApplyInfo = (addr,name) => {
        return applicantInfo.map((e,i)=>{
            if ( e.address === addr ) {
                return <div key={i} className="personal-info-btmBackground">
                    <div className="personal-info-avator"></div>
                    <p className="personal-info-name">{e.username ? e.username : name}</p>
                    <div className="personal-info-contact">
                        <div className="personal-info-contact-item">
                            <Image src="/icon/telegram.png" alt="" quality={100} width={29} height={29} />
                        </div>
                        <div className="personal-info-contact-item">
                            <Image src="/icon/skype.png" alt="" quality={100} width={29} height={29} />
                        </div>
                        <div className="personal-info-contact-item">
                            <Image src="/icon/wechat.png" alt="" quality={100} width={29} height={29} />
                        </div>
                        <div className="personal-info-contact-item">
                            <Image src="/icon/discord.png" alt="" quality={100} width={29} height={29} />
                        </div>
                        <div className="personal-info-contact-item">
                            <Image src="/icon/whatsapp.png" alt="" quality={100} width={29} height={29} />
                        </div>
                    </div>
                    <div className="personal-info-goodSkill">
                        <p className="goodSkill-title">Good at skills</p>
                        {
                            e.role ? e.role.map((ele,index)=>(
                                <span key={index} className="goodSkill-item">{ele}</span>
                            ))
                            :
                            <span className="goodSkill-item">null</span>
                        }
                    </div>
                    <div className="personal-info-NFTs">
                        <p className="NFTs-title">NFT held by him<span>more<DoubleRightOutlined /></span></p>
                        <div className="NFTs-img">
                            <div className="NFTs-img-item">
                                <p className="NFTs-img-item-image"></p>
                                <p className="NFTs-img-item-name">Okay Apes #12332</p>
                                <p className="NFTs-img-item-desc">Okay Apes Club</p>
                                <p className="NFTs-img-item-price">price</p>
                                <p className="NFTs-img-item-time">Ends in 15 hours</p>
                            </div>
                            <div className="NFTs-img-item">
                                <p className="NFTs-img-item-image"></p>
                                <p className="NFTs-img-item-name">Okay Apes #12332</p>
                                <p className="NFTs-img-item-desc">Okay Apes Club</p>
                                <p className="NFTs-img-item-price">price</p>
                                <p className="NFTs-img-item-time">Ends in 15 hours</p>
                            </div>
                            <div className="NFTs-img-item">
                                <p className="NFTs-img-item-image"></p>
                                <p className="NFTs-img-item-name">Okay Apes #12332</p>
                                <p className="NFTs-img-item-desc">Okay Apes Club</p>
                                <p className="NFTs-img-item-price">price</p>
                                <p className="NFTs-img-item-time">Ends in 15 hours</p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        })
    } 

    // 用户头像
    const hashAvt = (addr) => {
        if (!addr) {
            return
        }
        var hash = addr;  // 15+ hex chars
        // var options = {
        //     foreground: [r, g, b, 255],               // rgba black
        //     background: [255, 255, 255, 255],         // rgba white
        //     margin: 0.2,                              // 20% margin
        //     size: 420,                                // 420px square
        //     format: 'svg'                             // use SVG instead of PNG
        //     };
        // create a base64 encoded SVG
        // var data = new Identicon(hash, options).toString();
        var data = new Identicon(hash, {format: 'svg'}).toString();
        data = `data:image/svg+xml;base64,${data}`
        return data
    }

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
        taskId = location.search.slice('?')[1];
        setTaskId(taskId);
    },[])

    useEffect(()=>{
        getApplyListInfo()
    },[data])

    useEffect(()=>{
        if(isConnected){
            wagmi = {
                isActive: isConnected
            }
        }else{
            wagmi = {
                isActive: isConnected
            }
        }
        setWagmi({...wagmi})
    },[isConnected])


    return <div className="Applylist">
        <div className="task-info">
            <div className="task-demand">
                <p className="task-title">{demandData.title}</p>
                <p className="task-skill">
                    <i className="skill-tip">Recruitment type:</i>
                    {
                        demandData.skill?.map((e,i)=>e?(<span key={i}>{skills[e]}</span>):"")
                    }
                </p>
                <p className="task-cycle">cycle：
                    <span>{parseInt(demandData.period/86400)}天</span>
                    Cost：
                    <span>{demandData.budget}ETH</span>
                </p>
            </div>
            {/* <div className="task-changeInfo" onClick={showModifyModal}>修改信息</div>
            <div className="task-delete" onClick={deleteTask}>删除任务</div>
            <div className="task-apply-switch" onClick={applyHandler}>{allInfo.apply_switch?"关闭报名":"开启报名"}</div> */}
            <div className="apply-number">
                <p className="a-number">{demandData.applyNum}</p>
                <p className="a-tip">Number of applicants</p>
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
            <h4>Registration list</h4>
            <div className="product-list">
                <ul>
                    {
                        data.map((e,i) => <li key={i} className={e.sort === 0 ? 'sort':''} >
                            <div className="product-list-item">
                                <div className="product-list-info">
                                    <div className="product-img">

                                    </div>
                                    <div className="product-info">
                                        <p className="applicant-name" >{e.address}<span onClick={()=>{setIsInfoModal(!isInfoModal), seeHim(e.apply_addr,e.address)}}>View personal information</span></p>
                                        <p className="applicant-skill">
                                            <i className="good-skill">Good at skills：</i>
                                            {showSkills(e.apply_addr)}
                                        </p>
                                        <div className="applicant-mess">
                                            <div className="applicant-mess-item">
                                                <Image src="/icon/telegram.png" alt="" quality={100} width={29} height={29} />
                                            </div>
                                            <div className="applicant-mess-item">
                                                <Image src="/icon/skype.png" alt="" quality={100} width={29} height={29} />
                                            </div>
                                            <div className="applicant-mess-item">
                                                <Image src="/icon/wechat.png" alt="" quality={100} width={29} height={29} />
                                            </div>
                                            <div className="applicant-mess-item">
                                                <Image src="/icon/discord.png" alt="" quality={100} width={29} height={29} />
                                            </div>
                                            <div className="applicant-mess-item">
                                                <Image src="/icon/whatsapp.png" alt="" quality={100} width={29} height={29} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="product-apply">
                                        <span className="product-apply-he">His offer:</span>
                                        <span className="product-apply-price">{e.price}ETH</span>
                                        <div className="product-apply-time">
                                            <span className="product-apply-time-icon"><img src="/clock.jpg" /></span>
                                            <Computing_time create_time={e.create_time} />
                                        </div>
                                    </div>
                                </div>
                                <div className="product-apply-desc">
                                    <span></span>
                                    <div className="product-apply-desc-text">
                                        <p>{e.desc}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="product-collaborate">
                                    <p onClick={() => {worker = e.apply_addr, setWorker(worker) ,showModal()}}>Invite</p>
                                    <p onClick={() => sort(e.apply_addr, i)} className="product-collaborate-no">Improper</p>
                                </div>
                            </div>
                        </li> )
                    }
                </ul>
            </div>
            {/* <div className="task-page">
                <Pagination defaultCurrent={1} total={50} />
            </div> */}
        </div>
        <div className="task-bottom">1</div>
        <Modal 
            open={isModalOpen} 
            footer={null} 
            onCancel={handleCancel}
            className="modal-order-receiver"
            closeIcon={<img src="/closeIcon.png" />}
        >
            <div className="order-receiver-icon">
                <Image src="/tipIcon.png" width={87} height={79} quality={100} />
            </div>
            <p className="order-receiver-title">Give your budget</p>
            <InputNumber className="order-receiver-price" controls={false} addonAfter={selectAfter} onChange={onchange} />
            <p className="order-receiver-inviteTip">After selecting the order to be received, please communicate with the order receiver and wait for the order receiver to submit the stage division。</p>
            <Button className="btn" onClick={() => invitation()}>Invite cooperation</Button>
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
        <Modal
            footer={null}
            open={isInfoModal}
            onCancel={()=>setIsInfoModal(!isInfoModal)}
            className="personal-info"
            closeIcon={<img src="/closeIcon.png" />}
        >
            <div className="personal-info-topBackground"></div>
            {applicantInfo?showApplyInfo(seeAddr,nameAddr):""}
        </Modal>
    </div>
}