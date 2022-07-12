import { useEffect } from "react"
import Link from 'next/link'
import Router from "next/router";
import { message, Popconfirm } from 'antd';


function ProjectList(obj) {


    const goDetail = id => {
        Router.push({pathname:'/views/Ord_detail',search: id})
    }

    const confirm = (e) => {
        // 删除项目
        console.log(e);
        message.success('Click on Yes');
    };
      
    const popLayer = () => {
        return <div className="popLayer">
            <div className="panel">
                
            </div>
        </div>
    }

    const modify = () => {

    }
    
    return(
        <div className="ProjectList">
            <div className="top">
                <p className="title">
                    NO.1000 图书管理系统
                    {/* { this.obj.oid } */}
                    {/* { this.obj.title } */}
                </p>
                <div className="state">
                    <div>
                        报名数 5
                        {/* {this.obj.apllyCount} */}
                    </div>
                    <div>
                        招募中
                        {/* { this.obj.status } */}
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="img">
                    
                </div>
                <div className="rules">
                    <div className="rule">
                        <p><span>APP开发</span><span>开发团队</span></p>
                        {/* {this.obj.pjcType} */}
                    </div>
                    <div className="rule">
                        <span>金额 ¥40,000</span><div className="line"></div><span>周期 30天</span><div className="line"></div>
                        {/* { this.obj.price } */}
                        {/* { this.obj.p } */}
                    </div>

                </div>
            </div>
            <div className="list">
                    
                {/* {
                    this.obj.status === '招募中' ? <button>编辑项目</button> : ''
                } */}

                
                <button onClick={()=>{goDetail()}}>查看项目状态</button>

                <button onClick={()=>{goDetail()}}>修改项目</button>
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
    )
}

export default ProjectList