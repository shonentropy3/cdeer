import { useEffect, useState } from "react"
import RegistrationList from '../../../components/RegistrationList'
import style from '../../../styles/utils.module.scss'
import { Menu, message, Switch } from 'antd';
import NavigationBar from "../../../components/NavigationBar";
import { getDemandInfo, modifyApplySwitch, getMyApplylist } from "../../http/api";
import { translatedPjc, translatedRole } from '../../utils/translated'

export default function OrderDetail(oid) {

    let [data,setData] = useState({})

    const [selectItem,setSelectItem] = useState('item-1')
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

    const panel = () => {
        switch (selectItem) {
            case 'item-1':
                return  <div className='container'>
                            <div className="content">
                                <h1>{data.title}</h1>
                                <p>NO.{data.id}</p>
                                
                                <p>金额:{data.budget}</p>
                                <p>周期:{data.period}</p>
                                <p>招募角色:{data.role}</p>
                                <p>项目类型:{data.demand_type}</p>
                                <p>项目描述:{data.content}</p>
                                
                            </div>
                        </div>
            default: 
                return  <div className="container">
                            <div className="top">
                            </div>
                            <div className="content">
                                {
                                    applylist.map((e,i) => <RegistrationList data={e} key={i} />)
                                }
                            </div>
                        </div>
        }
    }

    //修改报名
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

    const init = async() => {
        oid = location.search
        oid = oid.replace('?','')
        await getDemandInfo({id:oid})
        .then(res => {
            let r = res.data
            Array.from(r).forEach((e,i) => {
                r[i].role = translatedRole(e.role)
                r[i].demand_type = translatedPjc(e.demand_type)
              })
            data = r[0]
            setData({...data})
            checked = data.apply_switch === 1 ? true : false
            setChecked(checked)
        })
        .catch(err => {
            console.log(err);
        })

        // 获取报名列表
        getMyApplylist({demandId: data.demand_id})
        .then(res => {
            applylist = res 
            setApplylist([...applylist])
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(()=>{
        init()

    },[])

 

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