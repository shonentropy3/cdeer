import { useEffect, useState } from "react"
import Link from 'next/link'
import Router from "next/router";
import { message, Popconfirm } from 'antd';
// import DeletDemand from '../controller/deletDemand';
import ModifyDemand from '../controller/modifyDemand';
import { modifyDemand } from '../pages/http/api';
import Modify from "./Modify";

function ProjectList(props) {
    const {data} = props
    const goDetail = id => {
        Router.push({pathname:'/views/Ord_detail',search: id})
    }
    let [maskStatus,setMaskStatus] = useState(false)


        // 修改需求
    const modifyDemandFun = async(e) => {
        await ModifyDemand(demandId,account)
        console.log(e);
        message.success('Click on Yes');
        // 2、修改需求
        modifyDemand(demandId,account)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          })
    };

    const confirm = (e) => {
        // await DeletDemand(para,account)
        // 删除项目
        console.log(e);
        message.success('Click on Yes');
    };
    
    const toggleMask = () => {
        maskStatus = !maskStatus
        setMaskStatus(maskStatus)
    }


    return(
        <>
        {
            maskStatus ? 
            <div className="Mask">
                <Modify data={data.user_address} setParent={setMaskStatus} />
            </div>
            :
            ''
        }
        <div className="ProjectList">
            <div className="top">
                <p className="title">
                    NO.{data.id} {data.title}
                </p>
                <div className="state">
                    <div>
                        {/* 报名数  */}
                        {/* ====== */}
                    </div>
                    <div>
                        {/* 招募中 */}
                        {/* { this.obj.status } */}
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="img">
                    
                </div>
                <div className="rules">
                    <div className="rule">
                        <p><span>{data.pro_type}</span><span>{data.role}</span></p>
                    </div>
                    <div className="rule">
                        <span>金额 ¥{data.budget}</span><div className="line"></div><span>周期 {data.period}天</span><div className="line"></div>
                    </div>

                </div>
            </div>
            <div className="list">
                    
                {/* {
                    this.obj.status === '招募中' ? <button>编辑项目</button> : ''
                } */}

                
                <button onClick={()=>{goDetail()}}>查看项目状态</button>
                <button onClick={() => {toggleMask()}}>修改需求</button>

                <Popconfirm
                    title="Are you sure to delete this task?"
                    onConfirm={confirm}
                    okText="Yes"
                    cancelText="No"
                >
                    <button>删除项目</button>
                </Popconfirm>
                
            </div>
        </div>
        </>
    )
}

export default ProjectList