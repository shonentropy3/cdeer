import { useState,useEffect } from 'react';
import { useAccount } from 'wagmi';
import { 
    Button,
    Modal,
    Input
 } from 'antd';
import {
    WechatOutlined,
    SkypeOutlined,
    GithubOutlined,
    CameraOutlined
  } from '@ant-design/icons';

import { setMyInfo,getMyInfo,modifyMyInfo } from '../http/api';

export default function myInfo() {

    let [inner,setInner] = useState({})
    let [username,setUserName] = useState()
    let [telegram,setTelegram] = useState("")
    let [wechat,setWeChat] = useState("")
    let [skype,setSkype] = useState("")
    let [userSkills,setUserSkills] = useState([])
    let [avatar,setAvatar] = useState("")
    let [userInfo,setUserInfo] = useState({})
    let [hasInfo,setHasInfo] = useState(false)

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
        console.log(e);
        e.status = !e.status
        skills.map((ele,index)=>{
            if(index === i){
                ele = e
                if(e.status){
                    userSkills.push(e.title)
                }else{
                    userSkills = userSkills.filter(item => item !== e.title)
                }
            }
        })
        setSkills([...skills])
        setUserSkills([...userSkills])
    }

    const saveHanler = ()=>{
        console.log('username====>',username);
        console.log('telegram====>',telegram);
        console.log('wechat====>',wechat);
        console.log('skype====>',skype);
        console.log('userSkills====>',userSkills);
        // let telegramValue
        // let wechatValue
        // let skypeValue
        // if(telegram == null){
        //     setTelegram("")
        // }
        
        let info = {
            username,
            telegram,
            wechat,
            skype,
            address,
            role:userSkills,
            avatar: ""
        }
        // console.log(info);
        console.log(hasInfo);
        if(hasInfo){
            // setMyInfo(info)
            console.log("set");
        }else{
            // modifyMyInfo(info)
            console.log("mofify");
        }
        
    }

    const changeAvatar = () => {
        console.log('更换头像');
    }

    const getInfo = async () => {
        await getMyInfo(address)
        .then((res)=>{
            console.log(res);
            let obj = res[0]
            // console.log(obj.role);
            setUserInfo({...obj})
            setUserName(obj.username)
            setTelegram(obj.telegram)
            setWeChat(obj.wechat)
            setSkype(obj.skype)
            setUserSkills([...obj.role])
            if(res){
                setHasInfo(true)
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    useEffect(()=>{
        getInfo()
    },[])

    useEffect(()=>{
        userSkills.map((e,i)=>{
            skills.map((ele,index)=>{
                if(e === ele.title){
                    ele.status = true
                }
            })
        })
    },[userSkills])

    
    return <>
    <div style={{height: '100px'}} ></div>
<div className="MyInfo">
        <div className="myInfo-top">
            <div className="top">
                <div className="img"></div>
                <div className="info">
                    <p>{userInfo.username?userInfo.username:"未设置用户昵称"}</p>
                    <div className="li"><SkypeOutlined /><WechatOutlined /><GithubOutlined /></div>
                </div>
            </div>
            <Button className="btn" onClick={showModal}>编辑个人资料</Button>
        </div>
        <div className="myInfo-bottom">
            <p className="bg">擅长技能</p>
            {
                userInfo.role ? userInfo.role.map((e,i)=>
                    <span key={i} className="role-list">{e}</span>
                ):<Button className="btn">添加擅长的技能</Button>
            }
            {/* <Button className="btn">添加擅长的技能</Button> */}
            
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
                            value={username}
                            onChange={(e)=>setUserName(e.target.value)} 
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
                            value={telegram} 
                            onChange={(e)=>setTelegram(e.target.value)}
                        />
                    </div>
                    <div className="inner">
                        <Input 
                            type="text" 
                            placeholder='WeChat' 
                            value={wechat}
                            onChange={(e)=>setWeChat(e.target.value)}
                        />
                    </div>
                    
                    <div className="inner">
                        <Input 
                            type="text" 
                            placeholder='Skype' 
                            value={skype}
                            onChange={(e)=>setSkype(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="box">
                <p className="title">你擅长的技能*</p>
                <div className="list">
                    {/* TODO: usestate li */}
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
            <Button className="btn" onClick={saveHanler}>保存</Button>
        </Modal>
    </div>
    </>
    
}