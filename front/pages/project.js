

import { Button,Modal,message, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { ethers } from "ethers";

import { useContracts } from '../controller';
import { applyFor, cancelApply } from '../http/api/apply';
import { getMyInfo } from '../http/api/user';

import { deform_Count, deform_Skills } from '../utils/Deform';
import ApplyTaskModal from '../components/CustomModal/ApplyTaskModal';
import Computing_time from '../components/Computing_time';
import { searchTaskDetail } from '../http/_api/public';
import qs from 'querystring';
import { createApply } from '../http/_api/task';

export default function Project() {
    
    const router = useRouter();
    const { address } = useAccount();
    let { useTaskContractWrite: Task } = useContracts("applyFor");
    let { useTaskContractWrite: celTask } = useContracts("cancelApply");
    let [params,setParams] = useState({});
    let [isModalOpen,setIsModalOpen] = useState(false);
    let [detail,setDetail] = useState();


    // 记录当前任务的报名信息
    let [userApplyInfo,setUserApplyInfo] = useState({})
    // 记录用户的联系方式
    let [userContact,setUserContact] = useState({})
    // 用于判断该用户是否报名此任务
    let [isApply,setIsApply] = useState(false)
    
    const showModal = ()=>{
        setIsModalOpen(true)
    }

    const handleCancel = ()=>{
        setIsModalOpen(false)
    }

    const apply = (obj) => {
        let flag = false;
        for (const i in obj) {
            if (obj[i] === '') {
                flag = true
            }
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

    const writeSuccess = () => {
        createApply({
            apply_addr: address,
            hash: Task.data.hash,
            task_id: detail.task_id
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

    const guide = () => {
        // TODO: 判断用户资料是否完整 > '报名成功,自动消失' : '报名成功,不消失,补充资料跳转'
        getMyInfo({address: address})
        .then(res => {
            if (!res.data[0]) {
                // 未填写资料
                openNotification()
            }else{
                // 已填写
                message.success('报名成功')
                setTimeout(() => {
                    history.go(-1);
                }, 500);
            }
        })
    }

    const openNotification = () => {
        setTimeout(() => {
            history.go(-1);
        }, 500);
        notification.info({
            message: '报名成功',
            description:
              '个人资料尚未填写完成,点击跳转补全信息',
            className: 'Notice',
            top: '100px',
            placement: 'top',
            duration: 0,
            getContainer: '',
            onClick: () => {
            notification.destroy()
              setTimeout(() => {
                router.push('/myInfo');
              }, 1000);
            },
          });
    }

    // 获取用户个人信息
    const getUserInfo = () => {
        getMyInfo({address:address})
        .then((res) => {
            if (res.data[0]) {
                userContact = res.data[0]
                setUserContact({...userContact})
            }
        })
    }

    // 用户取消报名
    const celApply = () => {
        celTask.write({
            recklesslySetUnpreparedArgs:[
                Number(taskID)
            ] 
        })
    }

    const celSuccess = () => {
        let data = {
            applyAddr: address,
            demandId: taskID,
            hash: celTask.data.hash
        }
        cancelApply(data)
        .then((res) => {
            message.success("取消报名成功")
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        Task.isSuccess && writeSuccess()
    },[Task.isSuccess])

    useEffect(()=>{
        getUserInfo()
    },[])

    useEffect(() => {
        celTask.isSuccess ?
        celSuccess()
        : ""
    },[celTask.isSuccess])

    const init = () => {
        const { task_id, id, issuer } = qs.parse(location.search.slice(1));
        // searchTaskDetail
        searchTaskDetail({
            task_id: task_id,
            id: id,
            issuer: issuer
        })
        .then(res => {
            if (res.code === 0) {
                detail = res.data.list[0];
                detail.role = deform_Skills(detail.role);
                detail.budget = deform_Count(detail.budget,detail.currency);
                setDetail(detail);
                console.log(detail);
            }
        })
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
                    isApply ? 
                    <div className='applyed-btns'>
                        <Button className='applyed-inspect' onClick={()=>setIsModalOpen(true)}>Registration information</Button>
                        <Button className='applyed-cancel' onClick={celApply}>Cancel registration</Button>
                    </div> 
                    :
                    <Button className="btn" onClick={showModal}>Go to register</Button>
                }
            </div>
            {
                isApply ? 
                <p className='applyed-tip'>The Task party is reviewing, and will contact your reserved social account after the review. Please check</p>
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
        <Modal
            footer={null}
            open={isModalOpen}
            onCancel={handleCancel}
            className="modal-apply-task"
        >
            {/* <Modal_applyTask setParams={setParams} params={params} project={project} submit={apply} applyInfo={userApplyInfo} userContact={userContact} /> */}
            <ApplyTaskModal setParams={setParams} params={params} project={detail} submit={apply} applyInfo={userApplyInfo} userContact={userContact} />
        </Modal>
    </div>
}