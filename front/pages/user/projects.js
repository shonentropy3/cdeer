import { useEffect, useState } from "react"
import { Empty, Button } from 'antd';
import { useAccount } from 'wagmi'
import { useRouter } from "next/router";
import { getUserApply } from "../../http/api";
import { deform_ProjectTypes, deform_Skills } from "../../utils/Deform";


export default function Userprojects(params) {

    const { address } = useAccount();
    const router = useRouter();
    let sidbar = [
        {title: '报名中的项目', value: 'apply', data: []},
        {title: '参与中的项目', value: 'developping', data: []},
        {title: '已完成的项目', value: 'developend', data: []},
    ]
    
    let [selectItem,setSelectItem] = useState({item: 'apply', data: []})

    const changeItem = value => {
        selectItem.item = value;
        setSelectItem({...selectItem});
    }

    const getApply = () => {
        console.log('hhh');
        getUserApply({hash: `'${address}'`})
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

    const getDevelopping = () => {
        // TODO: 获取正在进行的项目
    }

    const getDevelopend = () => {
        // TODO: 获取已经结束的项目
    }

    useEffect(() => {
        switch (selectItem.item) {
            case 'apply':
                getApply()
                break;
            case 'developping':
                getDevelopping()
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
            }
        </div>
    </div>   
}