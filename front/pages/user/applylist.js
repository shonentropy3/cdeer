import { useEffect, useState } from "react"
import { Divider,Pagination } from "antd";
import {ClockCircleOutlined,MessageFilled} from "@ant-design/icons"


export default function applylist() {
    
    let [taskId,setTaskId] = useState('');

    useEffect(() => {
        taskId = location.search.slice('?')[1];
        setTaskId(taskId);
        console.log(taskId);
    },[])

    return <div className="Applylist">
        <div className="task-info">
            <div className="task-demand">
                <p className="task-title">XDAO运维+数据系统开发</p>
                <p className="task-skill">技术要求:
                    <span>solidity</span>
                    <span>javascript</span>
                    <span>前端</span>
                </p>
                <p className="task-cycle">项目周期:
                    <span>30天</span>
                    项目预算:
                    <span>10ETH</span>
                </p>
            </div>
            <div className="apply-number">
                <p className="a-number">3</p>
                <p>报名人数</p>
            </div>
        </div>
        <div className="product-stage">
            <span><Divider orientation="left">发布</Divider></span>
            <span><Divider orientation="left">报名中</Divider></span>
            <span><Divider orientation="left">阶段划分</Divider></span>
            <span><Divider orientation="left">开发中</Divider></span>
            <span><Divider orientation="right">完成</Divider></span>
        </div>
        <div className="task-list">
            <h4>报名列表</h4>
            <div className="product-list">
                <ul>
                <li>
                        <div className="product-list-item">
                            <div className="product-img"></div>
                            <div className="product-info">
                                <p className="applicant-name">托尼</p>
                                <p className="applicant-skill">擅长技能：
                                    <span>solidity、</span>
                                    <span>Ethereum、</span>
                                    <span>javascripts、</span>
                                </p>
                                <p className="applicant-info">
                                    <span>查看他的信息</span>
                                    <span>查看他的报名资料</span>
                                </p>
                                <p className="applicant-mess">
                                    <span className="applicant-mess-item"><MessageFilled />联系方式</span>
                                    <span className="applicant-mess-item"><MessageFilled />联系方式</span>
                                </p>
                            </div>
                            <div className="product-apply">
                                <p className="product-apply-price">10 ETH</p>
                                <p className="product-apply-he">他的报价</p>
                                <p className="product-apply-time">
                                    <span><ClockCircleOutlined /></span>
                                    <span className="product-apply-time-text">30分钟前报名</span>
                                </p>
                            </div>
                        </div>
                        <div>
                            <div className="product-collaborate">
                                <p className="product-collaborate-no">暂不合作</p>
                                <p>邀请合作</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="product-list-item">
                            <div className="product-img"></div>
                            <div className="product-info">
                                <p className="applicant-name">托尼</p>
                                <p className="applicant-skill">擅长技能：
                                    <span>solidity、</span>
                                    <span>Ethereum、</span>
                                    <span>javascripts、</span>
                                </p>
                                <p className="applicant-info">
                                    <span>查看他的信息</span>
                                    <span>查看他的报名资料</span>
                                </p>
                                <p className="applicant-mess">
                                    <span className="applicant-mess-item"><MessageFilled />联系方式</span>
                                    <span className="applicant-mess-item"><MessageFilled />联系方式</span>
                                </p>
                            </div>
                            <div className="product-apply">
                                <p className="product-apply-price">10 ETH</p>
                                <p className="product-apply-he">他的报价</p>
                                <p className="product-apply-time">
                                    <span><ClockCircleOutlined /></span>
                                    <span className="product-apply-time-text">30分钟前报名</span>
                                </p>
                            </div>
                        </div>
                        <div>
                            <div className="product-collaborate">
                                <p className="product-collaborate-no">暂不合作</p>
                                <p>邀请合作</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="product-list-item">
                            <div className="product-img"></div>
                            <div className="product-info">
                                <p className="applicant-name">托尼</p>
                                <p className="applicant-skill">擅长技能：
                                    <span>solidity、</span>
                                    <span>Ethereum、</span>
                                    <span>javascripts、</span>
                                </p>
                                <p className="applicant-info">
                                    <span>查看他的信息</span>
                                    <span>查看他的报名资料</span>
                                </p>
                                <p className="applicant-mess">
                                    <span className="applicant-mess-item"><MessageFilled />联系方式</span>
                                    <span className="applicant-mess-item"><MessageFilled />联系方式</span>
                                </p>
                            </div>
                            <div className="product-apply">
                                <p className="product-apply-price">10 ETH</p>
                                <p className="product-apply-he">他的报价</p>
                                <p className="product-apply-time">
                                    <span><ClockCircleOutlined /></span>
                                    <span className="product-apply-time-text">30分钟前报名</span>
                                </p>
                            </div>
                        </div>
                        <div>
                            <div className="product-collaborate">
                                <p className="product-collaborate-no">暂不合作</p>
                                <p>邀请合作</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="product-list-item">
                            <div className="product-img"></div>
                            <div className="product-info">
                                <p className="applicant-name">托尼</p>
                                <p className="applicant-skill">擅长技能：
                                    <span>solidity、</span>
                                    <span>Ethereum、</span>
                                    <span>javascripts、</span>
                                </p>
                                <p className="applicant-info">
                                    <span>查看他的信息</span>
                                    <span>查看他的报名资料</span>
                                </p>
                                <p className="applicant-mess">
                                    <span className="applicant-mess-item"><MessageFilled />联系方式</span>
                                    <span className="applicant-mess-item"><MessageFilled />联系方式</span>
                                </p>
                            </div>
                            <div className="product-apply">
                                <p className="product-apply-price">10 ETH</p>
                                <p className="product-apply-he">他的报价</p>
                                <p className="product-apply-time">
                                    <span><ClockCircleOutlined /></span>
                                    <span className="product-apply-time-text">30分钟前报名</span>
                                </p>
                            </div>
                        </div>
                        <div>
                            <div className="product-collaborate">
                                <p className="product-collaborate-no">暂不合作</p>
                                <p>邀请合作</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="task-page">
                <Pagination defaultCurrent={1} total={50} />
            </div>
        </div>
        
    </div>
}