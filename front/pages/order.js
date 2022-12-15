import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { Steps, Button, message, Modal, Image } from "antd";
import { getDemandInfo } from "../http/api/task";
import { multicallWrite, muticallEncode, useRead, useSignData } from "../controller";
import Stage_info from "../components/Stage_info";
import { ethers } from "ethers";
import { useAccount, useNetwork } from 'wagmi'
import { getOrdersInfo, getStagesHash, getStagesJson } from "../http/api/order";
import { getDate } from "../utils/getDate";
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { Step } = Steps;
import { deform_Skills } from '../utils/Deform';
import qs from 'querystring';
import { getOrderDetail } from "../http/_api/order";
import TaskDetail from "../components/CustomItem/TaskDetail";
import TaskNav from "../components/nav/TaskNav";
import UserDetail from "../components/CustomItem/UserDetail";

export default function Order(props) {
    
    const { address } = useAccount();
    let [search, setSearch] = useState({        // 地址栏参数
        who: '', order_id: ''
    });
    let [task, setTask] = useState();           // task详情
    let [order, setOrder] = useState();         // order详情
    

    const init = () => {
        const { w, order_id } = qs.parse(location.search.slice(1));
        search.who = w;
        search.order_id = order_id;
        setSearch({...search});

        // 获取任务详情

        let obj = {};
        if (w === 'issuer') {
            obj.issuer = address;
        }else{
            obj.worker = address;
        }

        getOrderDetail({order_id: order_id, ...obj})
        .then(res => {
            if (res.data?.list.length !== 0) {
                task = res.data.list[0].task;
                task.role = deform_Skills(task.role);
                setTask({...task});
                delete res.data.list[0].task;
                order = res.data.list[0];
                setOrder({...order});
            }
        })
    }

    useEffect(() => {
        init();
    },[])

    return <div className="WorkerProject">
                <TaskNav task={task} />

                {
                    order &&
                    <>
                        <div className="worker-steps">
                            <Steps current={order.progress} size="small">
                                <Step title="Start" />
                                <Step title="Stage plan" />
                                <Step title="Finish" />
                            </Steps>
                        </div>      
                        {/* 发单者 == 接单者 */}
                        <UserDetail address={search.who === 'issuer' ? order.worker : order.issuer} who={search.who} />
                    </>
                }
                
                <TaskDetail task={task} />
    </div>
}