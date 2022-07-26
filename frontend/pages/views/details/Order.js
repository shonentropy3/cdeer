import { useEffect, useState } from "react"
import RegistrationList from '../../../components/RegistrationList'
import style from '../../../styles/utils.module.scss'
import { Menu, message, Switch, Empty } from 'antd';
import NavigationBar from "../../../components/NavigationBar";
import { getDemandInfo, modifyApplySwitch, getMyApplylist } from "../../../http/api";
import { translatedPjc, translatedRole } from '../../../utils/translated'

export default function OrderDetail(oid) {

    let [data,setData] = useState({})
    let [selectItem,setSelectItem] = useState('item-1')
    let [checked,setChecked] = useState(null)
    let [applylist,setApplylist] = useState([])

    const items = [
        { label: '项目详情', key: 'item-1'}, // 菜单项务必填写 key
        { label: '报名列表', key: 'item-2'}
    ];

    const navbar = [
        { label: '我的项目', url: '/views/Myproject'},
        { label: '项目状态', url: '#'}
    ]


    const toggleNav = (item) => {
        selectItem = item.key
        setSelectItem(selectItem)
    }

    // 项目详情部分
    const getInfo = async() => {
        oid = location.search
        oid = oid.replace('?','')
        await getDemandInfo({id:oid})
        .then(res => {
            let r = res.data[0]
            r.role = translatedRole(r.role)
            r.task_type = translatedPjc(r.task_type)
            data = r
            setData({...data})
            checked = data.apply_switch === 1 ? true : false
            setChecked(checked)
        })
        .catch(err => {
            console.log(err);
        })
    }

    const detail = () => {
        return  <div className='container'>
                    <div className="content">
                        <h1>{data.title}</h1>
                        <p>NO.{data.id}</p>
                        
                        <p>金额:{data.budget}</p>
                        <p>周期:{data.period}</p>
                        <p>招募角色:{data.role}</p>
                        <p>项目类型:{data.task_type}</p>
                        <p>项目描述:{data.desc}</p>
                        
                    </div>
                </div>
    }

    // 报名列表部分
    const getList = () => {
        // 获取报名列表
        getMyApplylist({demandId: data.id})
        .then(res => {
            applylist = res 
            setApplylist([...applylist])
        })
        .catch(err => {
            console.log(err);
        })
    }

    const list = () => {
        return  <div className="container">
                    <div className="top">
                    </div>
                    <div className="content">
                        {
                            applylist.length > 0 ? 
                                applylist.map((e,i) => <RegistrationList data={e} key={i} />)
                            :
                            <Empty />
                        }
                    </div>
                </div>
    }

    const panel = () => {
        switch (selectItem) {
            case 'item-1':
                return  detail()
            case 'item-2':
                return  list()
        }
    }

    const applySwitch = async() => {
        let s = data.apply_switch === 1 ? 0 : 1
        
        checked = !checked
        setChecked(checked)
        let obj = {
            demandId: data.demand_id,
            buttonSwitch: s,
        }
        obj = JSON.stringify(obj)
        modifyApplySwitch({proLabel: obj})
        .then(res => {
            console.log('res==>',res);
            message.success('修改成功')
            setTimeout(() => {
                window.location.reload()
            }, 500);
        })
        .catch(err => {
            console.log('修改开关失败==>',err);
        })
    }

    useEffect(() => {
        switch (selectItem) {
            case 'item-1':
                getInfo()
                break;
            case 'item-2':
                getList()
                break;
            default:
                break;
        }
    },[selectItem])

    return (
        <div className="ord_detail">
            
            <NavigationBar data={navbar} />

            <div className={`topbar ${style.between} ${style.bgwhite} ${style.pdr10}`}>
                <Menu 
                items={items} 
                mode="horizontal"
                selectedKeys={selectItem}
                onSelect={(item)=>toggleNav(item)}
                />
                <div className="switch">
                    报名开关
                    <Switch loading={false} checked={checked} onClick={() => applySwitch()} />
                </div>
            </div>
            {panel()}
        </div>
    )    
}