import { useState,useEffect } from 'react';
import { useAccount } from 'wagmi';
import { 
    Button,
    Modal,
    Input,
    message
 } from 'antd';
import {
    WechatOutlined,
    SkypeOutlined,
    GithubOutlined,
    CameraOutlined
  } from '@ant-design/icons';

import { setMyInfo,getMyInfo,modifyMyInfo } from '../http/api/user';

export default function MyInfo() {

    let [hasInfo,setHasInfo] = useState(false)
    let [info,setInfo] = useState({})

    let [skills,setSkills] = useState([
        {title:'solidity', status: false},
        {title:'javascript', status: false},
        {title:'python', status: false},
        {title:'GO', status: false},
        {title:'C/C++', status: false},
        {title:'Android', status: false},
        {title:'HTML/CSS', status: false},
        {title:'IOS', status: false},
    ])
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { address } = useAccount()

    const showModal = () => {
      setIsModalVisible(true);
    };
  
    const handleCancel = () => {
      setIsModalVisible(false);
    };

    const checkSkill = (e,i)=>{
        e.status = !e.status
        skills.map((ele,index)=>{
            if (!info.role) {
                info.role = []
                if(index === i){
                    ele = e
                    if(e.status){
                        info.role.push(e.title)
                    }else{
                        info.role = info.role.filter(item => item !== e.title)
                    }
                }
            }else{
                if(index === i){
                    ele = e
                    if(e.status){
                        info.role.push(e.title)
                    }else{
                        info.role = info.role.filter(item => item !== e.title)
                    }
                }
            }
        })
        setSkills([...skills])
        setInfo({...info,role:[...info.role]})
    }

    const saveHanler = ()=>{
        let userinfo = {
            username:info.username,
            telegram:info.telegram,
            wechat:info.wechat,
            skype:info.skype,
            address,
            role:info.role ? info.role : [],
            avatar: ""
        }
        if(hasInfo){
            modifyMyInfo(userinfo)
            .then(res => {
                message.success('修改成功')
                setTimeout(() => {
                    history.go(0)
                }, 500);
            })
        }else{
            setMyInfo(userinfo)
            .then(res=>{
                message.success('编辑成功')
                setTimeout(() => {
                    history.go(0)
                },500)
            })
        }
        
    }

    const changeAvatar = () => {
        console.log('更换头像');
    }

    const getInfo = async () => {
        await getMyInfo({address: address})
        .then((res)=>{
            console.log(res);
            if (res.data[0]) {
                let obj = res.data[0]
                info = obj;
                setInfo({...info});
                if(res){
                    setHasInfo(true)
                }
                
            }
        })
    }

    useEffect(()=>{
        getInfo()
    },[])

    useEffect(()=>{
        if(info.role){
            info.role.map((e,i)=>{
                skills.map((ele,index)=>{
                    if(e === ele.title){
                        ele.status = true
                    }
                })
            })
        }
    },[info.role])

    
    return <>
    <div style={{height: '100px'}} ></div>
<div className="MyInfo">
        <div className="myInfo-top">
            <div className="top">
                <div className="img"></div>
                <div className="info">
                    <p>{info.username?info.username:"未设置用户昵称"}</p>
                    <div className="li"><SkypeOutlined /><WechatOutlined /><GithubOutlined /></div>
                </div>
            </div>
            <Button className="btn" onClick={showModal}>编辑个人资料</Button>
        </div>
        <div className="myInfo-bottom">
            <p className="bg">擅长技能</p>
            {
                info.role ? info.role.map((e,i)=>
                    <span key={i} className="role-list">{e}</span>
                ):<Button className="btn">添加擅长的技能</Button>
            }
            
        </div>
        <Modal title="修改资料" className="Modify_personal_information" footer={null} open={isModalVisible} onCancel={handleCancel}>
            <div className="avatar" onClick={changeAvatar}>
                <span>更换头像</span>
                <CameraOutlined className='camera' />
            </div>
            <div className="box">
                <p className="title">姓名*</p>
                <div className="inners">
                    <div className="inner">
                        <Input 
                            type="text" 
                            placeholder="name"
                            defaultValue={info.username}
                            onChange={(e)=>setInfo({...info,username:e.target.value})} 
                        />
                    </div>
                </div>
            </div>
            <div className="box">
                <p className="title"> 社交账号(至少一个)*</p>
                <div className="inners">
                    <div className="inner">
                        <Input 
                            type="text" 
                            placeholder='Telegram'
                            defaultValue={info.telegram}
                            onChange={(e)=>setInfo({...info,telegram:e.target.value})}
                        />
                    </div>
                    <div className="inner">
                        <Input 
                            type="text" 
                            placeholder='WeChat' 
                            defaultValue={info.wechat}
                            onChange={(e)=>setInfo({...info,wechat:e.target.value})}
                        />
                    </div>
                    
                    <div className="inner">
                        <Input 
                            type="text" 
                            placeholder='Skype' 
                            defaultValue={info.skype}
                            onChange={(e)=>setInfo({...info,skype:e.target.value})}
                        />
                    </div>
                </div>
            </div>
            <div className="box">
                <p className="title">你擅长的技能*</p>
                <div className="list">
                    {
                        skills.map((e,i) => 
                            <div 
                                key={i} 
                                className={`li ${e.status ? 'active':''}`}
                                onClick={()=>checkSkill(e,i)}
                            >
                                {e.title}
                            </div>
                        )
                    }
                </div>
            </div>
            <Button className="btn" onClick={() => saveHanler()}>保存</Button>
        </Modal>
    </div>
    </>
    
}