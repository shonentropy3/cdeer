import { useEffect, useState } from "react"
import Link from 'next/link'
import Router from "next/router";
import { message, Popconfirm } from 'antd';

import { cancelApply, deleteDemand } from '../pages/http/api';
import Modify from "./Modify";
import { CancelApply } from "../controller/ApplyProject";
import { checkWalletIsConnected } from "../pages/utils/checkWalletIsConnected";

function ProjectList(props) {
    const {data} = props
    const {type} = props

    const goDetail = () => {
        Router.push({pathname:'/views/Ord_detail',search: data.demand_id})
    }
    let [maskStatus,setMaskStatus] = useState(false)
    let [currentAccount, setCurrentAccount] = useState(null);




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
                        <span>金额 ¥{data.budget}</span><div className="line"></div><span>周期 {data.period}天</span><div className="line"></div>
                    </div>

                </div>
            </div>
            <div className="list">
                    
                {/* {
                    this.obj.status === '招募中' ? <button>编辑项目</button> : ''
                } */}

                {
                    type === "demand" ? 
                    <>
                        <button onClick={()=>{goDetail()}}>查看项目状态</button>
                        <button onClick={() => {toggleMask()}}>修改需求</button>
                        <Popconfirm
                            title="Are you sure to delete this task?"
                            onConfirm={deletDemand}
                            okText="Yes"
                            cancelText="No"
                        >
                            <button>删除项目</button>
                        </Popconfirm>
                    </>
                    :
                    <>
                        <Popconfirm
                            title="Are you sure to delete this task?"
                            onConfirm={() => deletExploitation(data.demand_id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <button>取消报名</button>
                        </Popconfirm>
                    </>
                }
                
                
            </div>
        </div>
        </>
    )
}

export default ProjectList