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

import { deform_Skills } from '../utils/Deform';
import qs from 'querystring';
import { getOrderDetail } from "../http/_api/order";
import TaskDetail from "../components/CustomItem/TaskDetail";
import TaskNav from "../components/nav/TaskNav";

export default function Order(props) {
    
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
        getOrderDetail({order_id: order_id})
        .then(res => {
            if (res.code === 0) {
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
                            <Steps 
                                // size="small" 
                                // current={order.progress} 
                                items={[{ title: 'Start' }, { title: 'Stage plan' }, { title: 'Finish' }]}
                            />
                        </div>      
                    
                    </>
                }
                
                <TaskDetail task={task} />
    </div>
}