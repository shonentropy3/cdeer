import { useEffect, useState } from "react";
import { Button, Steps } from "antd";
import { useAccount } from 'wagmi'
const { Step } = Steps;
import { deform_Skills } from '../utils/Deform';
import qs from 'querystring';
import { getOrderDetail } from "../http/_api/order";
import TaskDetail from "../components/CustomItem/TaskDetail";
import TaskNav from "../components/nav/TaskNav";
import UserDetail from "../components/CustomItem/UserDetail";
import OrderSetStage from "../components/CustomItem/OrderSetStage";
import OrderStageList from "../components/CustomItem/OrderStageList";
import { useContracts, useRead } from "../controller";
import { Sysmbol } from "../utils/Sysmbol";
import BigNumber from "bignumber.js";
import { BigNumberRandom, NonceBitmap, Permit2Nonce } from "../utils/Permit2Nonce";

export default function Order(props) {
    
    const { address } = useAccount();
    let [search, setSearch] = useState({        // 地址栏参数
        who: '', order_id: ''
    });
    let [task, setTask] = useState();           // task详情
    let [order, setOrder] = useState();         // order详情
    let [stages, setStages] = useState();       // 阶段详情
    let [progress, setProgress] = useState(0);       // 阶段详情

    // permit2 Nonce
    let [nonce, setNonce] = useState(0);
    let [nonceBitmap, setNonceBitmap] = useState(0);
    let [isUse, setIsUse] = useState(true);
    const { usePermit2Read: permit2Nonce } = useRead('nonceBitmap', [address, nonceBitmap])

    // dUSDT授权
    const { usedUSDTContractWrite: dUSDTapprove } = useContracts('approve');
    // dUSDT是否授权
    const { usedUSDTRead: dUSDTallowance } = useRead('allowance', [address, process.env.NEXT_PUBLIC_PERMIT2])

    useEffect(() => {
        if (permit2Nonce.data && nonce != 0) {
            isUse = Permit2Nonce(nonce, permit2Nonce.data.toString())
            setIsUse(isUse);
            if (!isUse) {
                nonceInit()
            }
        }
    },[permit2Nonce])
    
    const switchStages = () => {
        switch (order.progress) {
            case 0:
                return <OrderSetStage 
                    search={search} 
                    order={order} 
                    task={task} 
                    amount={task.budget}
                    dataStages={stages}
                    approve={dUSDTapprove}
                    allowance={dUSDTallowance}
                 />     //   设置阶段
            default:
                return <OrderStageList 
                    order={order} 
                    dataStages={stages} 
                    task={task} 
                />     //   阶段开始
        }
    }

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
        if (!address) {
            return
        }

        getOrderDetail({order_id: order_id, ...obj})
        .then(res => {
            if (res.data?.list?.length !== 0) {
                task = res.data.list[0].task;
                task.role = deform_Skills(task.role);
                setTask({...task});
                delete res.data.list[0].task;
                order = res.data.list[0];
                if (order.stage_json) {
                    // 如果有last_stage_json ==>
                    // 如果有last_stages ==>
                    let arr = []
                    if (order.status === 'WaitProlongAgree') {
                        let cache = order.stages;
                        order.stages = order.last_stages;
                        order.last_stages = JSON.parse(cache);
                    }

                    if (order.status === "WaitAppendAgree") {
                        order.last_stages = JSON.parse(order.last_stages);
                        order.last_stage_json = JSON.parse(order.last_stage_json);
                    }

                    order.stage_json = JSON.parse(order?.stage_json);
                    order.stages = JSON.parse(order.stages);

                    order.stages.amount.map((e,i) => {
                        arr.push({
                            amount: e,
                            period: order.stages.period[i],
                            name: order.stage_json.stages[i].milestone.title,
                            desc: order.stage_json.stages[i].milestone.content
                        })
                    })
                    stages = arr;
                    setStages([...stages]);
                }
                setOrder({...order});

                if (order.progress !== 0 && order.progress !== 1) {
                    progress = order.progress === 2 ? 1 : 2;
                    setProgress(progress);
                }
            }
        })
    }

    // const currencyAllowance = () => {

    //     function isApprove(allowance, func) {
    //         console.log(allowance);
    //         if (allowance == 0) {
    //             approve = func;
    //             setApprove({...approve});
    //         }
    //     }
    //     switch (order?.currency) {
    //         case Sysmbol().dUSDT:
    //             allowance = dUSDTallowance.data.toString();
    //             isApprove(allowance, dUSDTapprove);
    //             break;
        
    //         default:
    //             break;
    //     }
    //     setAllowance(allowance);
    // }

    const nonceInit = () => {
        nonce = BigNumberRandom();
        setNonce(nonce);
    
        nonceBitmap = NonceBitmap(nonce);
        setNonceBitmap(nonceBitmap);
    }

    useEffect(() => {
        init();
        nonceInit()
    },[])

    // const approveTest = () => {
    //     approve.writeAsync({
    //         recklesslySetUnpreparedArgs: [
    //             "0xd5fcbca53263fcac0a98f0231ad9361f1481692b", (Math.pow(2,32)-1).toString()
    //         ]
    //     })
    // }

    return <div className="WorkerProject">
                <TaskNav task={task} />

                {
                    order &&
                    <>
                        <div className="worker-steps">
                            <Steps current={progress} size="small">
                                <Step title="Start" />
                                <Step title="Stage plan" />
                                <Step title="Finish" />
                            </Steps>
                        </div>      
                        {/* 对方详情 */}
                        <UserDetail address={search.who === 'issuer' ? order.worker : order.issuer} who={search.who} />
                        {/* 事务状态 */}
                        {/* <OrderProgressNav /> */}
                        {/* 根据阶段打印 */}
                        {switchStages()}
                    </>
                }
                
                <TaskDetail task={task} />
    </div>
}