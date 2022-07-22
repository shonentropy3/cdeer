import { useEffect, useState } from "react"
import Link from 'next/link'
import Router from "next/router";
import { message, Popconfirm } from 'antd';

import Modify from "./Modify";
import { cancelApply, deleteDemand, getMyApplylist } from '../pages/http/api';
import { CancelApply } from "../controller/ApplyProject";
import { checkWalletIsConnected } from "../pages/utils/checkWalletIsConnected";
import getOrderStatus from "../pages/utils/getOrderStatus";

function ProjectList(props) {
    const {data} = props
    const {type} = props

    const goDetail = () => {
        Router.push({pathname:'/views/details/Order',search: data.task_id})
    }
    let [maskStatus,setMaskStatus] = useState(false)
    let [currentAccount, setCurrentAccount] = useState(null);
    let [pjcStatus, setPjcStatus] = useState(false)

    const deletDemand = async(e) => {
        // 删除项目
        let obj = {
            id: data.id,
            address: data.user_address
        }
        //TODO: 1.校验是否是本人 2.错误返回信息处理
        deleteDemand({data: obj})
        .then(res => {
          window.location.reload()
        })
        .catch(err => {
          console.log(err);
        })
    };

    const deletExploitation = async(e) => {
        currentAccount = await checkWalletIsConnected()
        setCurrentAccount(currentAccount)
        let tradeStatus = false
        let obj = {
            demandId: e,
            applyAddr: currentAccount
        }
        await CancelApply(obj)
        .then(res => {
            if (res.code) {
              tradeStatus = false
              message.error('交易失败!');
            }else{
              tradeStatus = true;
              obj.hash = res.hash
            }
        })
        if (tradeStatus) {
            console.log("quxiao=========");
            cancelApply(obj)
              .then(res => {
                
                message.success('取消报名成功!');
                setTimeout(() => {
                    window.location.reload()
                }, 500);
              })
              .catch(err => {
                console.log(err);
              })
        }
    }
    
    const toggleMask = () => {
        maskStatus = !maskStatus
        setMaskStatus(maskStatus)
    }

    const initialize = async() => {
        currentAccount = await checkWalletIsConnected()
        setCurrentAccount(currentAccount)
        // 获取报名列表
        getMyApplylist({demandId: data.demand_id})
        .then(res => {
            if (res.length > 0) {
                pjcStatus = true
                setPjcStatus(pjcStatus)
            }
        })
        // 获取订单状态
        let obj = {
            demand_id: Number(data.task_id),
            apply_addr: currentAccount
        }
        obj = JSON.stringify(obj)
        getOrderStatus(obj)
        .then(res => {
            console.log(res,'====');
            if (res.length === 3) {
                pjcStatus = true
                setPjcStatus(pjcStatus)
            }
        })
    }

    useEffect(() => {
        // 初始化
        initialize()
    },[])

    const btnList = () => {
        // 判断是开发者还是需求方
        if (type === "demand") {
            // 我发布的项目
            return <>
                        <button onClick={()=>{goDetail()}}>查看项目状态</button>
                        {
                            !pjcStatus ? 
                            <>
                                <button onClick={() => {toggleMask()}}>修改需求</button>
                                <Popconfirm
                                    title="Are you sure to delete this task?"
                                    onConfirm={deletDemand}
                                    okText="Yes"
                                    cancelText="No" >
                                    <button>删除项目</button>
                                </Popconfirm>
                            </>
                            :
                            ''
                        }
                        
                  </>
        }else{
            // 我开发的项目
            return <>
                        <Link href={{pathname:"/views/details/Project",search:data.demand_id}}>
                        <button>项目详情</button>
                        </Link>
                        {
                            !pjcStatus ? 
                            <>
                                <Popconfirm
                                    title="Are you sure to delete this task?"
                                    onConfirm={() => deletExploitation(data.demand_id)}
                                    okText="Yes"
                                    cancelText="No" >
                                    <button>取消报名</button>
                                </Popconfirm>
                            </>
                            :
                            ''
                        }
                  </>
        }
    }

    return(
        <>
        {
            maskStatus ? 
            <div className="Mask">
                <Modify data={data.user_address} setParent={setMaskStatus} detail={data} />
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
                        <p><span>{data.pro_typeNew}</span><span>{data.roleNew}</span></p>
                    </div>
                    <div className="rule">
                        <span>金额 ${data.budget}</span><div className="line"></div><span>周期 {data.period}天</span><div className="line"></div>
                    </div>

                </div>
            </div>
            <div className="list">
                    
                {/* {
                    this.obj.status === '招募中' ? <button>编辑项目</button> : ''
                } */}

                { btnList() }
                
                
            </div>
        </div>
        </>
    )
}

export default ProjectList