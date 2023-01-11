

import { Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';
import { useRouter } from 'next/router';
import { ethers } from "ethers";

import { useContracts } from '../../controller';

import { deform_Count, deform_Skills } from '../../utils/Deform';
import ApplyTaskModal from '../../components/CustomModal/ApplyTaskModal';
import Computing_time from '../../components/Computing_time';
import { getUserInfo, searchTaskDetail, updateUserInfo } from '../../http/_api/public';
import qs from 'querystring';
import { createApply, getApplyStatus, deleteApply, updateApplyInfo } from '../../http/_api/task';
import { getJwt } from '../../utils/GetJwt';
import { GetSignature } from '../../utils/GetSignature';
import ConnectModal from '../../components/CustomModal/ConnectModal';

export default function Task() {
    
    const router = useRouter();
    const { address } = useAccount();
    let { useTaskContractWrite: Task } = useContracts("applyFor");
    let { useTaskContractWrite: celTask } = useContracts("cancelApply");
    let [isModalOpen,setIsModalOpen] = useState(false);
    // task详情
    let [detail,setDetail] = useState();

    // 记录用户的联系方式
    let [userContact,setUserContact] = useState({})
    // 自我推荐
    let [desc, setDesc] = useState('');
    // task报名状态
    let [progress, setProgress] = useState(0);
    // task用户报名信息
    let [applyInfo,setApplyInfo] = useState({})
    // 报名按钮loading状态
    let [applyLoading,setApplyLoading] = useState(false)
    // 连接钱包弹窗
    const [isModalVisible, setIsModalVisible] = useState(false);
    // 发送签名
    const { data: signer } = useSigner();

    const showModal = ()=>{
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
        setIsModalOpen(true)
    }

    const handleCancel = ()=>{
        setIsModalOpen(false)
    }

    const apply = async(obj) => {
        desc = obj.desc;
        setDesc(desc);


        // 更新
        await updateUserInfo({
            ...userContact,
            address: address
        })
        .then(res => {
            console.log(res);
        })

        let flag = false;
        for (const i in obj) {
            if (obj[i] === '') flag = true
        }
        if (flag) {
            message.warning("请完善信息!")
            return
        }
        setApplyLoading(true)
        Task.write({
            recklesslySetUnpreparedArgs:[
                address,
                Number(detail.task_id),
                ethers.utils.parseEther(`${obj.valuation}`)
            ]
        })
    }

    const writeSuccess = async() => {
        applyInfo ? 
        await updateApplyInfo({
            task_id: detail.task_id,
            apply_addr: address,
            hash: Task.data.hash,
            desc: desc
        })
        .then((res)=>{
            if ( res.code === 0 ) {
                message.success(res.msg);
                setApplyLoading(false)
                setTimeout(()=>{
                    router.push(`/user/projects?w=worker&bar=apply&hash=${Task.data.hash}`)
                },500)
            }else{
                setApplyLoading(false)
                message.error(res.msg);
            }
        })
        :
        await createApply({
            apply_addr: address,
            hash: Task.data.hash,
            task_id: detail.task_id,
            desc: desc
        })
        .then(res => {
            if (res.code === 0) {
                setApplyLoading(false)
                message.success(res.msg);
                setTimeout(() => {
                    router.push(`/user/projects?w=worker&bar=apply&hash=${Task.data.hash}`)    //  跳转链接
                }, 500);
            } else {
                setApplyLoading(false)
                message.error(res.msg);
            }
        })
    }

    // 用户取消报名
    const celApply = () => {
        let taskID = detail.task_id
        celTask.write({
            recklesslySetUnpreparedArgs:[
                Number(taskID)
            ] 
        })
    }

    const celSuccess = () => {
        let data = {
            hash: celTask.data.hash
        }
        deleteApply(data)
        .then((res) => {
            if ( res.code == 0 ) {
                message.success(res.msg)
                history.go(0)
            }else{
                message.error(res.msg)
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        if (Task.isSuccess) {
            writeSuccess()
        }
    },[Task.isSuccess])

    useEffect(() => {
        if (Task.error) {
            setApplyLoading(false)
        }
    },[Task.error])


    useEffect(() => {
        celTask.isSuccess ?
        celSuccess()
        : ""
    },[celTask.isSuccess])

    const switchBtns = () => {
        switch (progress) {
            case 0:
                return <Button className="btn" onClick={showModal}>Go to register</Button>
            case 1:
                return <div className='applyed-btns'>
                    <Button className='applyed-inspect' onClick={()=>setIsModalOpen(true)}>Registration information</Button>
                    <Button className='applyed-cancel' onClick={celApply}>Cancel registration</Button>
                </div>
            case 2:
                        // 跳转Order页面
                return <Button className="btn" onClick={() => router.push(`/order?w=worker&order_id=1`)}>Phase division</Button>
            default:
                break;
        }
    }

    const init = async() => {
        const { id, issuer } = qs.parse(location.search.slice(1));
        const task_id = location.pathname.split('/')[2];
        // 获取task详情
        await searchTaskDetail({
            task_id: task_id, id: id, issuer: issuer
        })
        .then(res => {
            if (res.code === 0) {
                detail = res.data.list[0];
                detail.role = deform_Skills(detail.role);
                detail.budget = deform_Count(detail.budget,detail.currency);
                detail.desc = JSON.parse(detail.attachment).desc;
                detail.suffix = JSON.parse(detail.attachment).suffix;
                detail.attachment = JSON.parse(detail.attachment).attachment;
                setDetail(detail);
            }
        })
        if (!address) {
            return
        }

        // 获取用户个人信息
        await getUserInfo({address:address})
        .then((res) => {
            if (res.code === 0) {
                userContact = res.data
                setUserContact({...userContact})
            }else{
                userContact = null;
                setUserContact(userContact);
            }
        })

        // 获取该用户task状态
        var applyList;
        await getApplyStatus({
            address: address, task_id: task_id
        })
        .then(res => {
            if (res.code === 0) {
                applyList = res.data?.list || [];
            }
        })
        applyList.map((e)=>{
            if ( e.apply_addr == address ) {
                applyInfo = e;
                setApplyInfo({...applyInfo})
                console.log(applyInfo);
            }
        })
        if (applyList.length === 0) {
            progress = 0;   //  未报名
        }else if(applyList[0].status === 0) {
            progress = 1;   //  已报名
        }else{
            progress = 2;   //  甲方已选乙方
        }
        setProgress(progress);
    }

    useEffect(() => {
        init()
    },[])

    return <div className="project">
        {
            isModalVisible && 
            <ConnectModal
                setStatus={setIsModalVisible} 
                status={isModalVisible} 
            />
        }
        {
            detail &&
            <div className="project-content">
            <div className="content-nav">
                <div className="nav-left">
                    <div className="img">

                    </div>
                    <div className="info">
                        <p className="title">{detail.title}</p>
                        <div className='time'>
                            <img className='time-icon' src='/clock-white.jpg' />
                            <Computing_time create_time={detail.created_at} />
                        </div>
                        <p className="skills">
                                Recruitment type: {
                                detail.role.map((e,i) => <span key={i}>{e}</span> )
                            } 
                        </p>
                    </div>
                </div>
                { switchBtns() }
            </div>
            {
                progress === 1 ? 
                <p className='applyed-tip'>The Task party is reviewing, and will contact your reserved social account after the review. Please check</p>
                :
                progress === 2 ?
                <p className='applyed-tip2'>The Task party invites to cooperate with you</p>
                :
                ""
            }
            <div className="content-container">
                <p className='task-details'>Task Details</p>
                <div className='task-detail-list'>
                    <p className='task-type task-li'>
                        <span className='task-type-title title'>Type：</span>
                        <span className='task-type-text content'>Blockchain</span>
                    </p>
                    <p className='task-cost task-li'>
                        <span className='task-cost-title title'>Cost：</span>
                        <span className='task-cost-price content'>{detail.budget}{detail.currency}</span>
                    </p>
                    <p className='task-date task-li'>
                        <span className='task-date-title title'>Cycle：</span>
                        <span className='task-date-time content'>{detail.period / 86400}days</span>
                    </p>
                </div>
                <div className="content-li">
                    <p className="li-title">Task Description：</p>
                    <div className="li-box">
                        <p className="detail content">
                            {detail.desc}
                        </p>
                    </div>
                </div>
                {
                    detail.suffix &&
                    <div className="content-li">
                        <p className="li-title">Task document：</p>
                        <div className="li-box">
                            <div className="upload">
                                <p className="upload-title">{detail.suffix}</p>
                                {/* <p>下载</p> */}
                            </div>
                        </div>
                    </div>
                }
                <div className="content-li">
                    <p className="li-title">Skill requirements：</p>
                    <div className="li-box boxs">
                    {
                        detail.role.map((e,i) => <div className="box" key={i}>{e}</div> )
                    }
                    </div>
                </div>

            </div>
            </div>
        }
        {/* <Button type="primary" className="project-btn" onClick={showModal}>报名参加</Button> */}
        
            {/* <Modal_applyTask setParams={setParams} params={params} project={project} submit={apply} applyInfo={userApplyInfo} userContact={userContact} /> */}
            {
                isModalOpen &&
                <ApplyTaskModal 
                    open={isModalOpen} 
                    onCancel={handleCancel} 
                    project={detail} 
                    submit={apply} 
                    userContact={userContact} 
                    setUserContact={setUserContact} 
                    applyInfo={applyInfo} 
                    applyLoading={applyLoading}
                />
            }
    </div>
}