import { Button } from 'antd';
import { CloseCircleOutlined,CloseOutlined,FilePdfOutlined } from "@ant-design/icons"
import { useState,useEffect } from 'react';

export default function Modal_comfirmTask(params) {
    
    const { comfirm,inner,skills } = params

    let [needSkills,setNeedSkills] = useState([])
    let [ roles,setRoles ] = useState([])

    const requireSkill = () => {
        let nedSkills = []
        skills.list.map(ele=>{
            roles.map(e=>{
                if(e == ele.value){
                    nedSkills.push(ele.title)
                }
            })
        })
        needSkills = nedSkills
        setNeedSkills([...needSkills])
        console.log(needSkills);
    }

    useEffect(()=>{
        console.log(skills);
        let a = inner[3].value.split("{")
        let b = a[1].split("}")
        let roles = b[0].split(",")
        setRoles([...roles])
        console.log(roles);
    },[inner])
    
    useEffect(()=>{
        requireSkill()

    },[roles])


    return <div className='comfirm-task'>
        <p className="modal-title"> Confirm publishing Task <CloseOutlined className='modal-title' /></p>
            <div className="modal-info">
                <div className="info-full">
                    <p className="title">Entry Name</p>
                    <div className="content">{inner[0].value}</div>
                </div>
                {/* <div className="info-full">
                    <p className="title">项目类型</p>
                    <div className="content">区块链</div>
                </div> */}
                <div className="info-full info-half">
                    <div>
                        <p className="title">Task budget</p>
                        <div className="content">{inner[4].value} ETH</div>
                    </div>
                    <div>
                        <p className="title">Task cycle</p>
                        <div className="content">{inner[5].value} Day</div>
                    </div>
                </div>
                <div className="info-full">
                    <p className="title">Task Description</p>
                    <div className="content">{inner[1].value}</div>
                </div>
                <div className="info-full">
                    <p className="title">Task document</p>
                    <div className="content">
                        <p className='info-document'>
                            <FilePdfOutlined className='icon' />
                            <span className='document-name'>DAO运维项目需求.pdf</span>
                        </p>
                    </div>
                </div>
                <div className="info-full">
                    <p className="title">Skill requirements</p>
                    <div className="content">
                        {
                            needSkills.map((e,i)=>{
                                return <span className='info-skill' key={i}>{e}</span>
                            })
                        }
                    </div>
                </div>
                <Button className="btn" type="primary" onClick={() => comfirm()}>Confirm release</Button>
            </div>
    </div>
}