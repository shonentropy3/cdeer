import { useEffect, useState } from "react"
import RegistrationList from '../../components/RegistrationList'
import style from '../../styles/utils.module.scss'
import { Menu, Switch } from 'antd';
import NavigationBar from "../../components/NavigationBar";
import { getProjectDetail } from "../http/api";
import { translatedPjc, translatedRole } from '../utils/translated'


export default function OrderDetail(oid) {

    let [data,setData] = useState({})

    const [selectItem,setSelectItem] = useState('item-1')

    const items = [
        { label: '项目详情', key: 'item-1'}, // 菜单项务必填写 key
        { label: '报名列表', key: 'item-2'}
    ];

    const navbar = [
        { label: '我的项目', url: '/views/Myproject'},
        { label: '项目状态', url: ''}
    ]


    const toggleNav = (item) => {
        selectItem = item.key
        setSelectItem(selectItem)
    }

    useEffect(()=>{
        oid = location.search
        oid = oid.replace('?','')
        getProjectDetail({id:oid})
        .then(res => {
            Array.from(res).forEach((e,i) => {
                res[i].role = translatedRole(e.role)
                res[i].pro_type = translatedPjc(e.pro_type)
              })
            data = res[0]
            setData({...data})
        })
        .catch(err => {
            console.log(err);
        })

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
                    <Switch loading={false} defaultChecked />
                </div>
            </div>
            {
                selectItem === 'item-1' ? 

                <div className='container'>
                    {/* <div className="top">
                        <p>项目详情</p>
                    </div> */}
                    <div className="content">
                        <h1>{data.title}</h1>
                        <p>NO.{data.id}</p>
                        
                        <p>金额:{data.budget}</p>
                        <p>周期:{data.period}</p>
                        <p>招募角色:{data.role}</p>
                        <p>项目类型:{data.pro_type}</p>
                        <p>项目描述:{data.content}</p>
                        
                    </div>
                </div>
            :
                <div className="container">
                    <div className="top">
                        {/* <p>报名列表</p> */}
                    </div>
                    <div className="content">

                        <RegistrationList />
                        <RegistrationList />
                        <RegistrationList />
                    </div>
                </div>
            }


        </div>
    )    
}