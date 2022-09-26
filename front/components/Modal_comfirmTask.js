import { Button } from 'antd';
import { useState,useEffect } from 'react';

export default function Modal_comfirmTask(params) {
    
    const { comfirm,inner,skills } = params

    let [ roles,setRoles ] = useState([])

    useEffect(()=>{
        let role = inner[3].value
        console.log(role);
    },[])


    return <>
        <p className="modal-title"> 确认发布项目 </p>
            <div className="modal-info">
                <div className="info-full">
                    <p className="title">项目详情</p>
                    <div className="content">{inner[0].value}</div>
                </div>
                <div className="info-full">
                    <p className="title">项目类型</p>
                    <div className="content">区块链</div>
                </div>
                <div className="info-full info-half">
                    <div>
                        <p className="title">项目预算</p>
                        <div className="content">{inner[4].value} ETH</div>
                    </div>
                    <div>
                        <p className="title">项目周期</p>
                        <div className="content">{inner[5].value}天</div>
                    </div>
                </div>
                <div className="info-full">
                    <p className="title">项目描述</p>
                    <div className="content">{inner[1].value}</div>
                </div>
                <div className="info-full">
                    <p className="title">项目文档</p>
                    <div className="content">xxxx</div>
                </div>
                <div className="info-full">
                    <p className="title">技能要求</p>
                    <div className="content">
                        {
                            // skills.map((e,i)=>{
                            //     if(e.value === JSON.parse(inner[3].value))
                            // })
                            inner[3].value
                        }
                    </div>
                </div>
                <Button className="btn" type="primary" onClick={() => comfirm()}>确认发布</Button>
            </div>
    </>
}