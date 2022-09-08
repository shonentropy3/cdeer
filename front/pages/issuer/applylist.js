import { useEffect, useState } from "react"
import { Steps,Pagination } from "antd";
import {ClockCircleOutlined,MessageFilled} from "@ant-design/icons"
import { getMyApplylist } from "../../http/api";


export default function applylist() {
    
    let [taskId,setTaskId] = useState(null);
    let [data,setData] = useState([]);
    const { Step } = Steps;

    const getList = () => {
        getMyApplylist({demandId: taskId})
        .then(res => {
            res.map(e => {
                e.address = e.apply_addr.slice(0,5) + "..." + e.apply_addr.slice(38,42)
            })
            console.log(res);
            data = res;
            setData([...data]);
        })
    }

    useEffect(() => {
        // console.log(taskId);
        taskId !== null ? 
            getList()
            :
            ''
    },[taskId])

    useEffect(() => {
        taskId = location.search.slice('?')[1];
        setTaskId(taskId);
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
            <Steps size="small" current={1}>
                <Step title="发布" />
                <Step title="报名中" />
                <Step title="阶段划分" />
                <Step title="开发中" />
                <Step title="完成" />
            </Steps>
        </div>
        <div className="task-list">
            <h4>报名列表</h4>
            <div className="product-list">
                <ul>
                    {
                        data.map((e,i) => <li key={i}>
                            <div className="product-list-item">
                                <div className="product-img"></div>
                                <div className="product-info">
                                    <p className="applicant-name">{e.address}</p>
                                    <p className="applicant-skill">擅长技能：
                                        <span>solidity、</span>
                                        <span>php、</span>
                                        <span>javascripts</span>
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
                                    <p className="product-apply-price">{e.price} ETH</p>
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
                        </li> )
                    }
                </ul>
            </div>
            <div className="task-page">
                <Pagination defaultCurrent={1} total={50} />
            </div>
        </div>
        
    </div>
}