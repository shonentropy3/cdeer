import { Button } from 'antd';
import { CloseCircleOutlined,CloseOutlined,FilePdfOutlined } from "@ant-design/icons"
import { useState,useEffect } from 'react';

export default function ComfirmTaskModal(params) {
    
    const { comfirm, inner, skills, setStatus } = params

    let [needSkills,setNeedSkills] = useState([])
    
    useEffect(()=>{
        let nedSkills = []
        skills.list.map(ele=>{
            inner.role.map(e=>{
                if(e == ele.value){
                    nedSkills.push(ele.title)
                }
            })
        })
        needSkills = nedSkills
        setNeedSkills([...needSkills])
    },[])


    return <div className='comfirm-task'>
        <p className="modal-title"> Confirm publishing Task <CloseOutlined className='modal-title' onClick={() => setStatus(false)} /></p>
            <div className="modal-info">
                <div className="info-full">
                    <p className="title">Entry Name</p>
                    <div className="content">{inner.title}</div>
                </div>
                {/* <div className="info-full">
                    <p className="title">项目类型</p>
                    <div className="content">区块链</div>
                </div> */}
                <div className="info-full info-half">
                    <div>
                        <p className="title">Task budget</p>
                        <div className="content">{inner.budget} ETH</div>
                    </div>
                    <div>
                        <p className="title">Task cycle</p>
                        <div className="content">{inner.period} Day</div>
                    </div>
                </div>
                <div className="info-full">
                    <p className="title">Task Description</p>
                    <div className="content">{inner.desc}</div>
                </div>
                {
                    inner.suffix &&
                    <div className="info-full">
                        <p className="title">Task document</p>
                        <div className="content">
                            <p className='info-document'>
                                <FilePdfOutlined className='icon' />
                                <span className='document-name'>{inner.suffix}</span>
                            </p>
                        </div>
                    </div>
                }
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