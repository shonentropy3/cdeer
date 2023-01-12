import { Button, Empty, Modal, message, Skeleton } from "antd";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { modifyApplySwitch, deleteTask } from '../../http/_api/task'
import { ConvertToken, ConvertTokenAddress } from "../../utils/Currency";
import { HashAvatar } from "../../utils/HashAvatar";


export default function TaskItem(params) {
    
    const { taskList, select, who, taskModal, setTaskInfo, taskInfo, isLoading, skeletonHash } = params;
    const router = useRouter();
    const { address } = useAccount();

    // 修改报名开关
    const applySwitch = (id,sw) => {
        if ( sw == 1 ) {
            sw = 0
        }else{
            sw = 1
        }
        modifyApplySwitch({
            task_id: id,
            apply_switch: sw
        })
        .then((res)=>{
            if ( res.code == 0 ) {
                message.success(res.msg)
                setTimeout(() => {
                    history.go(0)
                }, 500);
            }else{
                message.error(res.msg)
            }
        })
    }

    // 选择修改的任务
    const checkItem = (e) =>{
        taskList.map((ele)=>{
            if ( e == ele.task_id ) {
                taskInfo = ele
                setTaskInfo({...taskInfo})
                taskModal(true)
            }
        })
    }

    // 删除任务需求
    const delTask = (id) => {
        deleteTask({
            task_id: id
        })
        .then((res)=> {
            if (res.code == 0) {
                message.success(res.msg)
                setTimeout(() => {
                    history.go(0)
                }, 500);
            }else{
                message.error(res.msg)
            }
        })
    }
    // TODO 

    const getAvatar = (url, addr) => {
        if (url) {
            return process.env.NEXT_PUBLIC_DEVELOPMENT_API + "/" + url
        }else{
            return HashAvatar(addr)
        }
    }

    const getUsername = (name, addr) => {
        if (name) {
            return name
        }else{
            return addr.substring(0,5) + "..." + addr.substring(38,42)
        }
    }

    const print = () => {
        switch (select) {
            case 'tasks':
                return taskList.map((e,i) => 
                    <div className="item" key={i}>
                        <div className="li" onClick={() => router.push(`/applylist?task_id=${e.task_id}`)}>
                            <div className="li-title">
                                <p className="text-ellipsis">{e.title}</p>
                            </div>
                            <div className="li-content">
                                <div className="li-info">
                                    <p className="role info-title">Recruitment type:  &nbsp;{e.role.map((ele,index) => <span key={index}>{ele}</span> )}</p>
                                    <div className="detail">
                                        <p className="info-content info-title">Cycle: &nbsp;<span>{e.period / 60 / 60 / 24}</span><span>&nbsp;Day</span></p>
                                        
                                        <p className="info-content info-title">Stage cost: &nbsp;
                                        {
                                            e.budget == 0 ? 
                                            <span>可报价</span>
                                            :
                                            <span>{e.budget}{e.currency}</span>
                                        }
                                        </p>
                                    </div>
                                </div>
                                {/* TODO: 修改Task ==> resolution */}
                                {/* <Button onClick={() => }>修改</Button> */}
                                <div className="li-num">
                                    <p>{e.apply_count}</p>
                                    <p>Number of applicants</p>
                                </div>
                                {
                                    address && 
                                    <div className="btns">
                                        <Button onClick={() => applySwitch(e.task_id,e.apply_switch)}>报名开关</Button>
                                        <Button onClick={() => delTask(e.task_id) }>删除需求</Button>
                                        <Button loading={isLoading} onClick={() => checkItem(e.task_id)}>Edit this item</Button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                )
            case 'apply':       //  TODO ==>
                return taskList.map((e,i) => 
                    <div className="item" key={i} onClick={() => router.push(`/project?task_id=${e.task_id}`)}>
                        <div className="li">
                            <div className="li-info">
                                <p className="title">{e.title}</p>
                                <p className="role">Recruitment type: {e.role.map((ele,index) => <span key={index}>{ele}</span> )}</p>
                                <div className="detail">
                                    <p>Cycle: {e.period / 60 / 60 / 24}天 <span>&nbsp;</span></p>
                                    <p>Cost: 
                                    {
                                        e.budget == 0 ? 
                                        <span>可报价</span>
                                        :
                                        <span>{e.budget}{e.currency}</span>
                                    }    
                                    </p>
                                </div>
                            </div>
                        </div>
                        {
                            e.status === 0 &&
                            <>
                                <Button>修改报名</Button>
                                <Button>取消报名</Button>
                            </>
                        }
                    </div>
                )
            case 'developping':
                return taskList.map((e,i) => 
                    <div className="item" key={i}>
                        <div className="li">
                        <div className="li-title">
                                <p className="text-ellipsis">{e.task.title}</p>
                            </div>
                            <div className="li-content">
                                <div className="li-info">
                                    <p className="role info-title">Recruitment type: &nbsp;{e.task.role.map((ele,index) => <span key={index}>{ele}</span> )}</p>
                                    <div className="detail">
                                        <p className="info-content info-title">Cycle: &nbsp;<span>{e.task.period / 60 / 60 / 24}</span><span>&nbsp;Day</span></p>
                                        
                                        <p className="info-content info-title">Stage cost: &nbsp;
                                        {
                                            e.budget == 0 ? 
                                            <span>可报价</span>
                                            :
                                            <span>{ConvertToken(e.currency, e.amount)}{ConvertTokenAddress(e.currency)}</span>
                                        }
                                        </p>
                                        <div className="info-title info-content flex">
                                            {
                                                address === e.issuer ? "Worker" : "Issuer"
                                            }: &nbsp;
                                            <div className="avatar">
                                                {
                                                   address === e.issuer ? 
                                                        <img src={getAvatar(e.worker_info.avatar, e.worker)} alt="" />
                                                        :    
                                                        <img src={getAvatar(e.issuer_info.avatar, e.issuer)} alt="" />
                                                }
                                            </div>
                                            <span className="ml55">
                                                {
                                                    address === e.issuer ? 
                                                        getUsername(e.worker_info.username, e.worker)
                                                        :
                                                        getUsername(e.issuer_info.username, e.issuer)
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {
                                    address && 
                                    <div className="btns">
                                        <Button  onClick={() => router.push(`/order?w=${who}&order_id=${e.order_id}`)}>View project progress</Button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                )
            default:
                return taskList.map((e,i) => 
                    <div className="item" key={i}>
                        <div className="li">
                        <div className="li-title">
                                <p className="text-ellipsis">{e.task.title}</p>
                            </div>
                            <div className="li-content">
                                <div className="li-info">
                                    <p className="role info-title">Recruitment type: &nbsp;{e.task.role.map((ele,index) => <span key={index}>{ele}</span> )}</p>
                                    <div className="detail">
                                        <p className="info-content info-title">Cycle: &nbsp;<span>{e.task.period / 60 / 60 / 24}</span><span>&nbsp;Day</span></p>
                                        
                                        <p className="info-content info-title">Stage cost: &nbsp;
                                        {
                                            e.budget == 0 ? 
                                            <span>可报价</span>
                                            :
                                            <span>{ConvertToken(e.currency, e.amount)}{ConvertTokenAddress(e.currency)}</span>
                                        }
                                        </p>
                                        <div className="info-title info-content flex">
                                            {
                                                address === e.issuer ? "Worker" : "Issuer"
                                            }: &nbsp;
                                            <div className="avatar">
                                                {
                                                   address === e.issuer ? 
                                                        <img src={getAvatar(e.worker_info.avatar, e.worker)} alt="" />
                                                        :    
                                                        <img src={getAvatar(e.issuer_info.avatar, e.issuer)} alt="" />
                                                }
                                            </div>
                                            <span className="ml55">
                                                {
                                                    address === e.issuer ? 
                                                        getUsername(e.worker_info.username, e.worker)
                                                        :
                                                        getUsername(e.issuer_info.username, e.issuer)
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {
                                    address && 
                                    <div className="btns">
                                        <Button  onClick={() => router.push(`/order?w=${who}&order_id=${e.order_id}`)}>View project progress</Button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                )
        }
    }

    return <>
        {
            skeletonHash && skeletonHash.hash && select === skeletonHash.bar &&    
            <div className="item" >
                <div className="li">
                    <Skeleton active  paragraph={{ rows: 2, }} />
                </div>
            </div>
        }
        {
            taskList.length > 0 ?
                print()
                :
                <Empty />
        }
    </>
}