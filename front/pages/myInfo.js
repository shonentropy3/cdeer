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
            modifyMyInfo(info)
            .then(res => {
                message.success('修改成功')
                setTimeout(() => {
                    history.go(0)
                }, 500);
            })
            console.log("mofify");  
        }else{
            setMyInfo(info)
            console.log("set");
        }
        
    }

    const changeAvatar = () => {
        console.log('更换头像');
    }

    const getInfo = async () => {
        await getMyInfo({address: address})
        .then((res)=>{
            if (res.code === 200) {
                let obj = res.data[0]
                info = obj;
                setInfo({...info});
                if(res){
                    setHasInfo(true)
                }
                return
                console.log(obj);
                setUserInfo({...obj})
                setUserName(obj.username)
                setTelegram(obj.telegram)
                setWeChat(obj.wechat)
                setSkype(obj.skype)
                setUserSkills([...obj.role])
                
            }
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
                    <p>{info.username?info.username:"未设置用户昵称"}</p>
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
                            defaultValue={info.username}
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
                            defaultValue={info.telegram}
                            onChange={(e)=>setTelegram(e.target.value)}
                        />
                    </div>
                    <div className="inner">
                        <Input 
                            type="text" 
                            placeholder='WeChat' 
                            defaultValue={info.wechat}
                            onChange={(e)=>setWeChat(e.target.value)}
                        />
                    </div>
                    
                    <div className="inner">
                        <Input 
                            type="text" 
                            placeholder='Skype' 
                            defaultValue={info.skype}
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
            <Button className="btn" onClick={() => saveHanler()}>保存</Button>
        </Modal>
    </div>
    </>
    
}