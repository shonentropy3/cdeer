import { CameraFilled, CameraOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Upload } from "antd";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { updateUserInfo } from "../../http/_api/user";
import { uploadImageProps } from "../upload/avatar";



export default function ModifyUserModal(params) {
    
    const _data = require("../../data/data.json")
    const { status, setStatus, info, roles, setRoles } = params;
    const { address } = useAccount();
    
    let [userInfo, setUserInfo] = useState();
    let [fileList, setFileList] = useState([
        {
            uid: '-1',
            name: 'avatar.png',
            status: 'done',
            url: '',
        }
    ]);

    const handleCancel = () => {
        setStatus(false);
    }

    const handleChange = (info, list) => {
        fileList = info.fileList;
        setFileList([...fileList]);
    }

    const uploadSuccess = (res, file) => {
        if (res.code === 0) {
            message.success(res.msg);
            fileList[0].status = "success";
        } else {
            message.error(res.msg);
            fileList[0].status = "error";
        }
        if (res.code !== 7) {
            userInfo.avatar = res.data.url;
        }
        setFileList([...fileList])
    }

    const changeUserInfo = (name,value) => {
        userInfo[name] = value;
        setUserInfo({...userInfo});
    }

    const saveHanler = ()=>{
        console.log('userInfo ==> ', userInfo);
        if(info){
            updateUserInfo(userInfo)
            .then(res => {
                message.success(res.msg)
                setTimeout(() => {
                    history.go(0)
                }, 500);
            })
        }else{
            // createUserInfo(userinfo)
            // .then(res=>{
            //     message.success(res.msg)
            //     setTimeout(() => {
            //         history.go(0)
            //     },500)
            // })
        }
    }

    const checkSkill = (e,i)=>{
        if (!userInfo) {
            userInfo.role = []
            roles.map((ele,index)=>{
                if(index === i){
                    ele = e
                    if(e.status && userInfo.role.length < 4){
                        userInfo.role.push(Number(e.value))
                    }else{
                        userInfo.role = userInfo.role.filter(item => item != e.value)
                        e.status = false
                    }
                }
            })
        }else{
            let flag = true;
            userInfo.role.map((ele,index) => {
                if (ele == e.value) {
                    flag = false;
                    // 去重
                    userInfo.role.splice(index,1);
                    // 去除status
                    roles.map(role => {
                        if (role.value == e.value) {
                            role.status = false;
                        }
                    })
                }
            })
            if (flag) {
                // 不可超过4个
                if (userInfo.role.length === 4) {
                    message.warning('不可超过四个')
                    return
                }else{
                    userInfo.role.push(Number(e.value));
                    e.status = true;
                    setRoles([...roles]);
                }
            }
        }
        setUserInfo({...userInfo});
    }

    useEffect(() => {
        if (info.avatar) {
            fileList[0].url = process.env.NEXT_PUBLIC_DEVELOPMENT_API + "/" + info.avatar;
        }else{
            fileList[0].url = process.env.NEXT_PUBLIC_DEVELOPMENT_API + "/uploads/file/2023/01/52bb59d2-c76c-49cb-8bd2-4fccd88b92d6.png"
        }
        setFileList([...fileList]);
    },[info.avatar])

    useEffect(() => {
        if (info) {
            userInfo = info;
            setUserInfo({...userInfo});
        }
    },[info])
    
    return  <Modal title="修改资料" className="Modify_personal_information" footer={null} open={status} onCancel={handleCancel}>
        <div className="avatar">
            <div className="img">

            </div>
            <Upload
                listType='picture-card'
                onChange={handleChange}
                onSuccess={uploadSuccess}
                className="item-upload"
                {...uploadImageProps}
                fileList={fileList}
                progress={{
                    strokeColor: {
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    },
                    strokeWidth: 3,
                    format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
                }}
            >
                <p className="upload-rule">
                    Support JPEG/JPEG/PNG format,
                    maximum file size: 2MB
                </p>
                <Button type="primary" icon={<CameraFilled />}>
                    <span className="ml20">更换头像</span>
                </Button>
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
                        onChange={(e)=> changeUserInfo('username',e.target.value)} 
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
                        onChange={(e) => changeUserInfo('telegram',e.target.value)}
                    />
                </div>
                <div className="inner">
                    <Input 
                        type="text" 
                        placeholder='WeChat' 
                        defaultValue={info.wechat}
                        onChange={(e) => changeUserInfo('wechat',e.target.value)}
                    />
                </div>
                
                <div className="inner">
                    <Input 
                        type="text" 
                        placeholder='Skype' 
                        defaultValue={info.skype}
                        onChange={(e) => changeUserInfo('skype',e.target.value)}
                    />
                </div>

                <div className="inner">
                    <Input 
                        type="text" 
                        placeholder='discord' 
                        defaultValue={info.discord}
                        onChange={(e) => changeUserInfo('discord',e.target.value)}
                    />
                </div>

                <div className="inner">
                    <Input 
                        type="text" 
                        placeholder='phone' 
                        defaultValue={info.phone}
                        onChange={(e) => changeUserInfo('phone',e.target.value)}
                    />
                </div>
            </div>
        </div>
        <div className="box">
            <p className="title">你擅长的技能*</p>
            <div className="list">
                {
                    roles.map((e,i) => 
                        i < 12 && i > 0 &&
                        <div 
                            key={i} 
                            className={`li ${e.status ? 'active':''}`}
                            onClick={()=>checkSkill(e,i)}
                        >
                            {e.name}
                        </div>
                    )
                }
            </div>
        </div>
        <Button className="btn" onClick={() => saveHanler()}>保存</Button>
    </Modal>
}