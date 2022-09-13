import { useEffect, useState } from "react"
import { Empty, Button } from 'antd';
import { useAccount } from 'wagmi'
import { useRouter } from "next/router";
import { getOrders, getUserApply } from "../../http/api";
import { deform_ProjectTypes, deform_Skills } from "../../utils/Deform";
import { useReads } from "../../controller/index";

export default function Userprojects(params) {

    const { address } = useAccount();
    const router = useRouter();
    let [sidbar,setSidbar] = useState([
        {title: '报名中的项目', value: 'apply', data: []},
        {title: '划分中的项目', value: 'stage', data: []},
        {title: '参与中的项目', value: 'developping', data: []},
        {title: '已完成的项目', value: 'developend', data: []},
    ]);
    let [selectItem,setSelectItem] = useState({item: 'apply', data: []})
    let [oidList,setOidList] = useState([]);
    let [orderDetail,setOrderDetail] = useState([]);
    const { useOrderReads: Order } = useReads('getOrder',oidList);
    
    const changeItem = value => {
        selectItem.item = value;
        setSelectItem({...selectItem});
    }

    const getApply = () => {
        getUserApply({hash: `'${address}'`})
        .then(res => {
            res.map(e => {
                e.role = deform_Skills(e.role);
                e.task_type = deform_ProjectTypes(e.task_type);
            })
            sidbar[0].data = res;
            setSidbar([...sidbar]);
            selectItem.data = res;
            setSelectItem({...selectItem});
        })
    }

    const getDevelopping = () => {
        // TODO: 获取正在进行的项目
        selectItem.data = sidbar[2].data;
        setSelectItem({...selectItem});
    }

    const getDevelopend = () => {
        // TODO: 获取已经结束的项目
        selectItem.data = sidbar[3].data;
        setSelectItem({...selectItem});
    }

    const getMyOrders = () => {
        getOrders(address)
        .then(res => {
            let arr = [];
            res.map(e => {
                arr.push(e.oid);
            })
            console.log(res);
            sidbar[1].data = res;
            setSidbar([...sidbar]);
            oidList = arr;
            setOidList([...oidList]);
        })
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

    const out = (arr) => {
        if (arr.length === 0) {
            return <Empty />
        }
        return (
            arr.map((e,i) => 
                <div key={i} className="li">
                    <div className="li-info">
                        <p className="title">{e.title}</p>
                        <p className="role">技术要求: {e.role.map((ele,index) => <span key={index}>{ele}</span> )}</p>
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
    
    const outStage = (arr) => {
        if (arr.length === 0 || arr[0].odata === undefined) {
            return <Empty />
        }
        return (
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
                        <Button type="primary">确认合作</Button>
                        <p>项目方邀请您合作</p>
                    </div>
                </div>
            )
        )
    }

    const print = () => {
        switch (selectItem.item) {
            case 'apply':
                return out(sidbar[0].data);
            case 'stage':
                return outStage(sidbar[1].data);
            case 'developping':
                return out(sidbar[2].data);
            default:
                return out(sidbar[3].data);
        }
    }

    useEffect(() => {
        oidList.length !== 0 ? 
            set()
            :
            ''
    },[oidList])


    useEffect(() => {
        switch (selectItem.item) {
            case 'apply':
                getApply()
                break;
            case 'developping':
                getDevelopping()
                break;
            case 'stage':
                getMyOrders()
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
            {
                print()
                // selectItem.data.length === 0 ?
                //     <Empty />
                //     :
                    // selectItem.data.map((e,i) => 
                    //     <div key={i} className="li">
                    //         <div className="li-info">
                    //             <p className="title">{e.title}</p>
                    //             <p className="role">技术要求: {e.role.map((ele,index) => <span key={index}>{ele}</span> )}</p>
                    //             <div>
                    //                 <p>项目周期: {e.period / 60 / 60 / 24}天</p>
                    //                 <p>项目预算: {e.budget}ETH</p>
                    //             </div>
                    //         </div>
                    //         <div className="li-right">
                    //             <Button>取消报名</Button>
                    //             <Button type="primary">修改报名信息</Button>
                    //         </div>
                    //     </div>
                    // )
            }
        </div>
    </div>   
}