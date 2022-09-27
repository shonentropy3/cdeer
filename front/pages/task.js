import { Button, Empty } from "antd";
import { useEffect, useState } from "react";
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { useReads } from "../controller";
import { getApplyData, getOrdersData, getTasksData } from "../http/api/task";
import { deform_Skills } from "../utils/Deform";



export default function Task() {
    
    let [who,setWho] = useState();
    let [tidList,setTidList] = useState([]); 
    let [selectItem,setSelectItem] = useState({item: '', data: []});
    let [sidbar,setSidbar] = useState([
        {title: '发布的项目', value: 'tasks'},
        {title: '进行中', value: 'developping'},
        {title: '发布的项目', value: 'developend'},
    ]);
    let [sidbarWorker,setSidbarWorker] = useState();
    const router = useRouter()
    const { address } = useAccount();
    const { useTaskReads } = useReads('tasks', tidList);

    const changeItem = value => {
        selectItem.item = value;
        selectItem.data = [];
        setSelectItem({...selectItem});
    }

    const getTasks = () => {
        getTasksData({hash: address})
        .then(res => {
            let arr = [];
            res.map(e => {
                e.role = deform_Skills(e.role);
                arr.push(e.id);
            })
            tidList = arr;
            setTidList([...arr])
            selectItem.data = res;
            setSelectItem({...selectItem});
        })
    }

    const getDevelopping = () => {
        let param = who === 'worker' ? address : address+'_'
        getOrdersData(param)
        .then(res => {
            let arr = [];
            console.log(res);
            res.map(e => {
                if (e.data) {
                    arr.push(e.oid);
                    e.data.role = deform_Skills(e.data.role);
                }
            })
            tidList = arr;
            setTidList([...arr])
            selectItem.data = res;
            setSelectItem({...selectItem});
        })
    }

    const getApply = () => {
        getApplyData({hash: `'${address}'`})
        .then(res => {
            let arr = [];
            res.map(e => {
                e.role = deform_Skills(e.role);
                arr.push(e.id);
            })
            tidList = arr;
            setTidList([...arr])
            selectItem.data = res;
            setSelectItem({...selectItem});
        })
    }


    const panel = () => {
        switch (selectItem.item) {
            case 'tasks':
                return Tasks()
            case 'developping':
                return Developping(selectItem.data)
            case 'apply':
                return Apply(selectItem.data)
            default:
                break;
        }
    }

    const Apply = (arr) => {
        if (arr.length === 0) {
            return <Empty />
        }
        return (
            arr.map((e,i) => 
                <div key={i} className="li">
                    <div className="li-info">
                        <p className="title">{e.title}</p>
                        {/* <p className="role">技术要求: {e.role.map((ele,index) => <span key={index}>{ele}</span> )}</p> */}
                        <div>
                            <p>项目周期: {e.period / 60 / 60 / 24}天</p>
                            <p>项目预算: {e.budget}ETH</p>
                        </div>
                    </div>
                    <div className="li-right">
                        <Button>取消报名</Button>
                        <Button type="primary">修改报名信息</Button>
                    </div>
                </div>
            )
        )
    }

    const Developping = (arr) => {
        return  <>
                    {
                        arr.length === 0 ?
                            <Empty />
                            :
                            arr.map((e,i) => 
                                <div key={i} className="li">
                                    <div className="li-info">
                                        <p className="title">{e.data.title}</p>
                                        <p className="role">技术要求: {e.data.role.map((ele,index) => <span key={index}>{ele}</span> )}</p>
                                        <div>
                                            <p>项目周期: {e.data.period / 60 / 60 / 24}天</p>
                                            <p>项目预算: {e.data.budget}ETH</p>
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

    const Tasks = () => {
        return  <>{
                    selectItem.data.length === 0 ?
                        <Empty />
                        :
                        selectItem.data.map((e,i) => 
                        <Link key={e.id} href={{pathname: '/issuer/applylist', search: e.id}}>
                            <div className="li">
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
                        </Link>)
                }</>
    }

    useEffect(() => {
        selectItem.data = [];
        setSelectItem({...selectItem});
        who = location.search.split('?')[1];
        setWho(who);
        if (who === 'worker') {
            sidbar = [
                {title: '报名中的项目', value: 'apply'},
                {title: '参与中的项目', value: 'developping'},
                {title: '已完成的项目', value: 'developend'},
            ];
            setSidbar([...sidbar]);
            selectItem.item = 'apply';
            setSelectItem({...selectItem});
        }else{
            sidbar = [
                {title: '发布的项目', value: 'tasks'},
                {title: '进行中', value: 'developping'},
                {title: '发布的项目', value: 'developend'},
            ]
            setSidbar([...sidbar]);
            selectItem.item = 'tasks';
            setSelectItem({...selectItem});
        }
    },[router])

    useEffect(() => {
        switch (selectItem.item) {
            case 'tasks':
                getTasks()
                break;
            case 'developping':
                getDevelopping()
                break;
            case 'apply':
                getApply()
                break;
            default:
                // getDevelopend()
                break;
        }
    },[selectItem.item])

    useEffect(() => {
        if (tidList.length !== 0) {
            let data = useTaskReads.data;
            selectItem.data.map((e,i) => {
                // TODO: 根据币种计算budget
                let multiple = data[i].currency === 1 ? Math.pow(10,18) : 1;
                if (selectItem.item === 'developping') {
                    e.data.budget = data[i].budget.toString() / multiple;
                }else{
                    e.budget = data[i].budget.toString() / multiple; 
                }
            })
            setSelectItem({...selectItem});
        }
    },[tidList])

    return (
        <div className="Userprojects">
            <div className="sidbar">
                    {
                        sidbar.map((e,i) => 
                            <div
                                key={i} 
                                className={`li ${selectItem.item === e.value ? 'active':''}`} 
                                onClick={() => changeItem(e.value)}
                                >
                                {e.title}
                            </div>)
                    }
            </div>
            <div className="content">
                {panel()}
            </div>
        </div>   
    )
}