

import { Button,Modal,message, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { ethers } from "ethers";

import { useContracts } from '../controller';
import { cancelApply } from '../http/api/apply';

import { deform_Count, deform_Skills } from '../utils/Deform';
import ApplyTaskModal from '../components/CustomModal/ApplyTaskModal';
import Computing_time from '../components/Computing_time';
import { createUserInfo, getUserInfo, searchTaskDetail, updateUserInfo } from '../http/_api/public';
import qs from 'querystring';
import { createApply, getApplyStatus, deleteApply, updateApplyInfo } from '../http/_api/task';

export default function Project() {
    
    const router = useRouter();
    const { address } = useAccount();
    let { useTaskContractWrite: Task } = useContracts("applyFor");
    let { useTaskContractWrite: celTask } = useContracts("cancelApply");
    let [isModalOpen,setIsModalOpen] = useState(false);
    let [detail,setDetail] = useState();

    // 记录用户的联系方式
    let [userContact,setUserContact] = useState({})
    // 自我推荐
    let [desc, setDesc] = useState('');
    // task报名状态
    let [progress, setProgress] = useState(0);
    // task用户报名信息
    let [applyInfo,setApplyInfo] = useState({})
    
    const showModal = ()=>{
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
                setTimeout(()=>{
                    router.push(`/task?w=worker&bar=apply`)
                },500)
            }else{
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
                message.success(res.msg);
                setTimeout(() => {
                    router.push(`/task?w=worker&bar=apply`)    //  跳转链接
                }, 500);
            } else {
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
            }else{
                message.error(res.msg)
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        Task.isSuccess && writeSuccess()
    },[Task.isSuccess])


    useEffect(() => {
        celTask.isSuccess ?
        celSuccess()
        : ""
    },[celTask.isSuccess])

    const init = async() => {
        const { task_id, id, issuer } = qs.parse(location.search.slice(1));
        // 获取task详情
        await searchTaskDetail({
            task_id: task_id, id: id, issuer: issuer
        })
        .then(res => {
            if (res.code === 0) {
                detail = res.data.list[0];
                detail.role = deform_Skills(detail.role);
                detail.budget = deform_Count(detail.budget,detail.currency);
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
        var orderList;
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
            }
        })
        // await getOrderStatus({
        //     worker: address, task_id: task_id
        // })
        // .then(res => {
        //     if (res.code === 0) {
        //         orderList = res.data?.list || [];
        //     }
        // })
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
                {
                    progress === 0 ?
                    <Button className="btn" onClick={showModal}>Go to register</Button>
                    :
                    progress === 1 ? 
                    <div className='applyed-btns'>
                        <Button className='applyed-inspect' onClick={()=>setIsModalOpen(true)}>Registration information</Button>
                        <Button className='applyed-cancel' onClick={celApply}>Cancel registration</Button>
                    </div> 
                    :
                    // 跳转Order页面
                    <Button className="btn">Phase division</Button>
                }
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
                <ApplyTaskModal open={isModalOpen} onCancel={handleCancel} project={detail} submit={apply} userContact={userContact} setUserContact={setUserContact} applyInfo={applyInfo} />
            }
    </div>
}