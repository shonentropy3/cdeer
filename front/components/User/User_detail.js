import { useAccount } from 'wagmi';
import axios from "axios";
import { useEffect, useState } from 'react';
import { 
    Button,
    Modal,
    Input,
    message,
    Upload
 } from 'antd';
import {
    WechatOutlined,
    SkypeOutlined,
    GithubOutlined,
    CameraOutlined
  } from '@ant-design/icons';
// import { useSetState } from 'ahooks';
import Identicon, { IdenticonOptions } from "identicon.js";

import { getUserInfo, createUserInfo, updateUserInfo } from '../../http/_api/user.js'

export default function User_detail () {
    const _data = require("../../data/data.json")

    let [hasInfo,setHasInfo] = useState(false)
    let [info,setInfo] = useState({})

    let [skills,setSkills] = useState([])
    let [wagmi,setWagmi] = useState({});
    let [avatar,setAvatar] = useState()

    const [isModalVisible, setIsModalVisible] = useState(false);

    const { address, isConnected } = useAccount()

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
                        info.role.push(Number(e.value))
                    }else{
                        info.role = info.role.filter(item => item != e.value)
                    }
                }
            }else{
                if(index === i){
                    ele = e
                    if(e.status){
                        info.role.push(Number(e.value))
                    }else{
                        info.role = info.role.filter(item => item != e.value)
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
            discord: info.discord,
            phone: info.phone,
            address,
            role:info.role ? info.role : [],
            avatar: info.avatar
        }
        console.log(userinfo);
        if(hasInfo){
            updateUserInfo(userinfo)
            .then(res => {
                message.success(res.msg)

                setTimeout(() => {
                    history.go(0)
                }, 500);
            })
        }else{
            createUserInfo(userinfo)
            .then(res=>{
                message.success(res.msg)
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
        await getUserInfo({address: address})
        .then((res)=>{
            console.log('个人信息====>',res);
            if (res.data) {
                let obj = res.data
                info = obj;
                setInfo({...info});
                if(res.code === 0){
                    setHasInfo(true)
                }
            }
        })
    }

    // 用户初始头像
    const hashAvt = () => {
        if (!address) {
            return
        }
        var hash = address;  // 15+ hex chars
        var data = new Identicon(hash, {format: 'svg'}).toString();
        data = `data:image/svg+xml;base64,${data}`
        return data
    }

    // 初始化技能列表
    const initSkills = () => {
        let arr = []
        _data.skills.map((e,i)=>{
            if (i > 0) {
                arr.push({title: e.name, status: false, value: e.value})
            }
        })
        skills = arr
        setSkills([...skills])
    }

    // 上传头像
    const avatarChange = (files) => {
        let res = files.file.response
        if (res?.code == 0) {
            info.avatar = res.data.url
            setInfo({...info})
        }
    }


    useEffect(()=>{
        initSkills()
        getInfo()
    },[])

    useEffect(()=>{
        if(info.role){
            info.role.map((e,i)=>{
                skills.map((ele,index)=>{
                    if(e == ele.value){
                        ele.status = true
                    }
                })
            })
        }
        setSkills([...skills])
    },[info.role])

    useEffect(()=>{
        if(isConnected){
            wagmi = {
                isActive: isConnected
            }
        }else{
            wagmi = {
                isActive: isConnected
            }
        }
        setWagmi({...wagmi})

    },[isConnected])

    //用户设置了头像时更新头像路径
    useEffect(()=>{
        if (info.avatar) {
            avatar = `http://192.168.1.10:8086/${info.avatar}`
            setAvatar(avatar)
        }
    },[info])

    return <div className="MyInfo">
    <div className="myInfo-top">
        <div className="top">
            <div className="img">
                {
                    wagmi.isActive ? 
                    <img src={avatar?avatar:hashAvt()} alt="" />
                    :
                    ""
                }
            </div>
            <div className="info">
                <p>{info.username?info.username:"未设置用户昵称"}</p>
                <div className="li">
                    {info.skype ? <SkypeOutlined /> : ''}
                    {info.wechat ? <WechatOutlined /> : ''}
                </div>
            </div>
        </div>
        <Button className="btn" onClick={showModal}>编辑个人资料</Button>
    </div>
    <div className="myInfo-bottom">
        <p className="bg">擅长技能</p>
        {
            skills.map((e,i)=>(
                e.status ? <span className='role-list' key={i}>{e.title}</span> : ''
            ))
        }
        
    </div>
    <Modal title="修改资料" className="Modify_personal_information" footer={null} open={isModalVisible} onCancel={handleCancel}>
        <div className="avatar" onClick={changeAvatar}>
            <Upload
                name='file'
                listType='picture-card'
                showUploadList='false'
                onChange={avatarChange}
                action='http://192.168.1.10:8086/common/uploadImage'
                >
                <span>更换头像</span>

                <CameraOutlined className='camera' />
            </Upload>
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

                <div className="inner">
                    <Input 
                        type="text" 
                        placeholder='discord' 
                        defaultValue={info.discord}
                        onChange={(e)=>setInfo({...info,discord:e.target.value})}
                    />
                </div>

                <div className="inner">
                    <Input 
                        type="text" 
                        placeholder='phone' 
                        defaultValue={info.phone}
                        onChange={(e)=>setInfo({...info,phone:e.target.value})}
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
}

