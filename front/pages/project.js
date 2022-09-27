

import { Button,Modal,message } from 'antd';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';

import { useContracts } from '../controller';
import { getDemandInfo } from '../http/api/task';
import { applyFor } from '../http/api/apply';
import { deform_Skills } from '../utils/Deform';
import Modal_applyTask from '../components/Modal_applyTask';


export default function project() {
    
    const router = useRouter();
    const { address } = useAccount();
    let { useTaskContractWrite: Task } = useContracts("applyFor");
    let [taskID,setTaskID] = useState('');
    let [project,setProject] = useState({});
    let [params,setParams] = useState({});
    let [isModalOpen,setIsModalOpen] = useState(false);


    const getProject = async() => {
        await getDemandInfo({id: taskID})
        .then(res=>{
            let obj = res.data[0]
            obj.role = deform_Skills(obj.role);
            project = obj;
            setProject({...project});
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

    const apply = () => {
        Task.write({
            recklesslySetUnpreparedArgs:[
                address,
                Number(taskID),
                Number(params.valuation) * 100
            ]
        })
    }

    const writeSuccess = () => {
        params.demandId = taskID;
        params.address = address;
        params.hash = Task.data.hash;
        params.valuation = params.valuation * 100;
        applyFor({proLabel: JSON.stringify(params)})
        .then(res => {
          message.success('报名成功!')
          setTimeout(() => {
            router.push('/')
          }, 500);
        })
        .catch(err => {
          console.log(err);
        })
    }

    useEffect(() => {
        taskID = location.search.slice('?')[1];
        setTaskID(taskID);
        getProject()
    },[])

    useEffect(() => {
        Task.isSuccess ? 
            writeSuccess()
            :
            ''
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
            footer={null}
            open={isModalOpen}
            onCancel={handleCancel}
        >
            <Modal_applyTask setParams={setParams} params={params} submit={apply} />
        </Modal>
    </div>
}