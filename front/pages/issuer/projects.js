import { useEffect, useState } from "react"
import { Empty, Button } from 'antd';
import { useAccount } from 'wagmi'
import { useRouter } from "next/router";
import { getMyDemand, getOrders } from "../../http/api";
import { deform_ProjectTypes, deform_Skills } from "../../utils/Deform";
import { useReads } from "../../controller";

export default function Issuerprojects(params) {

    const { address } = useAccount();
    const router = useRouter();
    let [sidbar,setSidbar] = useState([
        {title: '发布的项目', value: 'tasks', data: []},
        {title: '划分中的项目', value: 'stage', data: []},
        {title: '进行中', value: 'developping', data: []},
        {title: '发布的项目', value: 'developend', data: []},
    ])
    let [oidList,setOidList] = useState([]);
    let [selectItem,setSelectItem] = useState({item: 'tasks', data: []})
    const { useOrderReads: Order } = useReads('getOrder',oidList);

    const goUserProject = (oid) => {
        router.push({pathname:'/issuer/Project', search: oid})
    }  

    const changeItem = value => {
        selectItem.item = value;
        setSelectItem({...selectItem});
    }

    const getTasks = () => {
        getMyDemand({hash: address})
        .then(res => {
            res.map(e => {
                e.role = deform_Skills(e.role);
                e.task_type = deform_ProjectTypes(e.task_type);
            })
            sidbar[0].data = res;
            selectItem.data = res;
            setSelectItem({...selectItem});
            console.log(res);
        })
    }

    const getStages = () => {
        getOrders(address+'_')
        .then(res => {
            let arr = [];
            res.map(e => {
                if (e.data) {
                    arr.push(e.oid);
                    e.data.role = deform_Skills(e.data.role);
                    e.data.task_type = deform_ProjectTypes(e.data.task_type);
                }
            })
            sidbar[1].data = res;
            setSidbar([...sidbar]);
            oidList = arr;
            setOidList([...oidList]);
        })
        
    }

    const getDevelopping = () => {
        // TODO: 获取正在进行的项目
    }

    const getDevelopend = () => {
        // TODO: 获取已经结束的项目
    }

    const goApplylist = (id) => {
        router.push({pathname:'/issuer/applylist',search: id})
    }

    const panelTask = () => {
        return  <>
                    {
                        selectItem.data.length === 0 ?
                            <Empty />
                            :
                            selectItem.data.map((e,i) => 
                                <div key={i} className="li" onClick={() => goApplylist(e.id)}>
                                    <div className="li-info">
                                        <p className="title">{e.title}</p>
                                        <p className="role">技术要求: {e.role.map((ele,index) => <span key={index}>{ele}</span> )}</p>
                                        <div>
                                            <p>项目周期: {e.period / 60 / 60 / 24}天</p>
                                            <p>项目预算: {e.budget}ETH</p>
                                        </div>
                                    </div>
                                    <div className="li-num">
                                        <p>{e.apply_count}</p>
                                        <p>报名人数</p>
                                    </div>
                                </div>
                            )
                    }
                </>
    }

    const panelStage = (arr) => {
        return  <>
                    {
                        arr.length === 0 || arr[0].odata === undefined ?
                            <Empty />
                            :
                            arr.map((e,i) => 
                                <div key={i} className="li">
                                    <div className="li-info">
                                        <p className="title">{e.data.title}</p>
                                        <p className="role">技术要求: {e.data.role.map((ele,index) => <span key={index}>{ele}</span> )}</p>
                                        <div>
                                            <p>项目周期: {e.data.period / 60 / 60 / 24}天</p>
                                            <p>项目预算: {e.odata.amount}ETH</p>
                                        </div>
                                    </div>
                                    <div className="li-right">
                                        <Button type="primary" onClick={() => goUserProject(e.oid)}>阶段详情</Button>
                                    </div>
                                </div>
                            )
                    }
                </>
    }
 
    const panel = () => {
        switch (selectItem.item) {
            case 'tasks':
                return panelTask()
            case 'stage':
                return panelStage(sidbar[1].data)
            default:
                break;
        }
    }

    const set = () => {
        sidbar[1].data.map((e,i) => {
            e.odata = {
                issuer: Order.data[i].issuer,
                worker: Order.data[i].worker,
                token: Order.data[i].token,
                amount: Order.data[i].amount.toString(),
                progress: Order.data[i].progress,
                startDate: Order.data[i].startDate.toString(),
                payed: Order.data[i].payed.toString()
            }
        })
        setSidbar([...sidbar])
    }

    useEffect(() => {
        oidList.length !== 0 ? 
            set()
            :
            ''
    },[oidList])

    useEffect(() => {
        switch (selectItem.item) {
            case 'tasks':
                getTasks()
                break;
            case 'developping':
                getDevelopping()
                break;
            case 'stage':
                getStages()
                break;
            default:
                getDevelopend()
                break;
        }
    },[selectItem.item])
    
    return <div className="Userprojects">
    <div className="sidbar">
        {
            sidbar.map((e,i) => 
            <div 
                key={i} 
                className={`li ${selectItem.item === e.value ? 'active':''}`} 
                onClick={() => changeItem(e.value)}
                >
                {e.title}
            </div> )
        }
    </div>
    <div className="content">
        {panel()}
    </div>
</div>   
}