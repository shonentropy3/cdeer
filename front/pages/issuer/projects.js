import { useEffect, useState } from "react"
import { Empty } from 'antd';
import { useAccount } from 'wagmi'
import { useRouter } from "next/router";
import { getMyDemand } from "../../http/api";
import { deform_ProjectTypes, deform_Skills } from "../../utils/Deform";

export default function Issuerprojects(params) {

    const { address } = useAccount();
    const router = useRouter();
    let sidbar = [
        {title: '发布的项目', value: 'tasks', data: []},
        {title: '划分中的项目', value: 'stage', data: []},
        {title: '进行中', value: 'developping', data: []},
        {title: '发布的项目', value: 'developend', data: []},
    ]
    
    let [selectItem,setSelectItem] = useState({item: 'tasks', data: []})

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
        })
    }

    const getStages = () => {
        sidbar[1].data = [];
        selectItem.data = [];
        setSelectItem({...selectItem});
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
                            <p>1</p>
                            <p>报名人数</p>
                        </div>
                    </div>
                )
        }
    </div>
</div>   
}