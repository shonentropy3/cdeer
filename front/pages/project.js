

import { Button,Modal,message } from 'antd';
import { useEffect, useState } from 'react';

import { useAccount } from 'wagmi';
import { useContracts } from '../controller';

import { ethers } from 'ethers';

import { getDemandInfo } from '../http/api';
import { deform_ProjectTypes, deform_Skills } from '../utils/Deform';

// import { Button,Modal } from 'antd';
// import { useEffect, useState } from 'react';


// import { getDemandInfo } from '../http/api';
// import { deform_ProjectTypes, deform_Skills } from '../utils/Deform';
// import { ApplyProject } from '../controller/task';


import Modal_applyTask from '../components/Modal_applyTask';


export default function project(params) {
    
    let [taskID,setTaskID] = useState('');
    let [project,setProject] = useState({});

    const [cost,setCost] = useState("")
    let {address} = useAccount()
    let {useTaskContractWrite:Task} = useContracts("applyFor")

    let [isModalOpen,setIsModalOpen] = useState(false)




    const getProject = async() => {
        await getDemandInfo({id: taskID})
        .then(res=>{
            let obj = res.data[0]
            obj.role = deform_Skills(obj.role);
            obj.task_type = deform_ProjectTypes(obj.task_type);
            project = obj;
            setProject({...project});
            console.log(project);
        })
        .catch(err=>{
            console.log(err);
        })
    }



    const showModal = ()=>{
        setIsModalOpen(true)
    }

    const handleCancel = ()=>{
        setIsModalOpen(false)
    }

    const apply = (cost)=>{
        let id = Number(taskID)
        let _cost = Number(cost)
        console.log(typeof address,id,_cost);
        Task.write({
            recklesslySetUnpreparedArgs:[address,id,_cost]
        })
        console.log(Task.isSuccess);
    }

    useEffect(() => {
        console.log(Task.error);
    },[Task.error])

    useEffect(() => {
        taskID = location.search.slice('?')[1];
        setTaskID(taskID);
        getProject()
    },[])


    useEffect(() => {
        taskID = location.search.slice('?')[1];
        setTaskID(taskID);
        getProject()
    },[])

    useEffect(()=>{
        console.log(Task.isSuccess);
    },[Task.isSuccess])

    return <div className="project">
        <div className="project-content">
        <div className="content-nav">
            <div className="nav-left">
                <div className="img">

                </div>
                <div className="info">
                    <p className="title">{project.title}</p>
                    <p className="skills">
                        技术要求: {
                            project.role ? 
                                project.role.map((e,i) => <span key={i}>{e}</span> )
                                :
                                ''
                        } 
                    </p>
                </div>
            </div>
            <Button className="btn">报名参与</Button>
        </div>
        <div className="content-container">
            <div className="content-li">
                <p className="li-title">项目类型</p>
                <div className="li-box boxs">
                    {
                        project.task_type ? 
                        project.task_type.map((e,i) => <div className="box" key={i}>{e}</div> )
                        :
                        ''
                    }
                </div>
            </div>
            <div className="content-list">
                <div className="list-li">
                    <p className="li-title">项目费用</p>
                    <div className="li-box">
                        <p className="detail">{project.budget}ETH</p>
                    </div>
                </div>
                <div className="list-li">
                    <p className="li-title">项目周期</p>
                    <div className="li-box">
                        <p className="detail">{project.period / 60 / 60 / 24}天</p>
                    </div>
                </div>
            </div>
            <div className="content-li">
                <p className="li-title">项目描述</p>
                <div className="li-box">
                    <p className="detail content">
                        {project.desc}
                    </p>
                </div>
            </div>
            <div className="content-li">
                <p className="li-title">项目文档</p>
                <div className="li-box">
                    <div className="upload">
                        <p className="upload-title">{project.suffix}</p>
                        <p>下载</p>
                    </div>
                </div>
            </div>
            <div className="content-li">
                <p className="li-title">技能要求</p>
                <div className="li-box boxs">
                {
                        project.role ? 
                        project.role.map((e,i) => <div className="box" key={i}>{e}</div> )
                        :
                        ''
                    }
                </div>
            </div>

        </div>
        </div>
        <Button type="primary" className="project-btn" onClick={showModal}>报名参加</Button>
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
        >
            <Modal_applyTask apply={apply} taskID={taskID} />
        </Modal>
    </div>
}