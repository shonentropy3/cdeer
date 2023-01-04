import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import User_detail from '../components/User/User_detail';
import { getUserInfo } from '../http/_api/user';
import Identicon from "identicon.js";
import UserSocialMedia from '../components/CustomItem/UserSocialMedia';
import { FormOutlined } from '@ant-design/icons';
import { Button, Input, Modal } from 'antd';
const { confirm } = Modal;

export default function MyInfo() {

    const _data = require("../data/data.json")
    const { address } = useAccount();

    let [userInfo, setUserInfo] = useState();
    let [nftAddress, setNftAddress] = useState();

    const changeNftAddress = (value) => {
        nftAddress = value;
        setNftAddress(nftAddress);
    }
    
    const addNft = () => {
        confirm({
            className: "addNft",
            okText: "添加",
            cancelText: "取消",
            icon: <></>,
            content: <div className="addNft-Modal">
                <div className="img"></div>
                <p className="title">添加NFT</p>
                <div className="inner">
                    <p className="inner-title">输入NFT地址链接</p>
                    <Input onChange={(e) => changeNftAddress(e.target.value)} />
                </div>
            </div>,
            onOk() {
              console.log('OK ==>',nftAddress);
            },
            onCancel() {
              console.log('Cancel');
            },
        });
    }

    const hashAvt = (address) => {
        var hash = address;  // 15+ hex chars
        var data = new Identicon(hash, {format: 'svg'}).toString();
        data = `data:image/svg+xml;base64,${data}`
        return data
    }

    const init = () => {
        if (!address) {
            return
        }
        getUserInfo({address: address})
        .then(res => {
            console.log(res);
            if (res.code === 0) {
                userInfo = res.data;
                // console.log(_data.skills);
                setUserInfo({...userInfo});
            }
        })
    }

    useEffect(() => {
        init()
    },[address])
    
    return <div className='myinfo'>
        <div className="myinfo-content">
            <div className="userInfo">
                {
                    userInfo &&
                    <>
                    <div className="userInfo-detail">
                        <div className="detail-avatar">
                            {
                                userInfo.avatar ? 
                                <img src={userInfo.avatar} alt="" />
                                :
                                <img src={hashAvt(userInfo.address)} alt="" />
                            }
                        </div>
                        <p className="detail-name">
                            {
                                userInfo.username ? 
                                userInfo.username
                                :
                                "未设置用户昵称"
                            }
                        </p>
                        <div className="detail-sociality">
                            {
                                !userInfo.discord && !userInfo.phone && !userInfo.skype && !userInfo.telegram && !userInfo.wechat ? 
                                "no social account"
                                :
                                <UserSocialMedia userInfo={userInfo}/>
                            }
                        </div>
                    </div>
                    <div className="userInfo-role">
                        <p className="title">技能</p>
                        <div className="roles">
                            {
                                userInfo.role.map((e,i) => 
                                    <span className='role' key={i}>
                                        {e}
                                    </span>
                                )
                            }
                        </div>
                        <Button type="primary" icon={<FormOutlined />}>
                            <span className="ml20">编辑个人资料</span>
                        </Button>
                    </div>
                    <div className="nft">
                        <div className="nft-all">
                            <div className="nft-item ">
                                <div className="item-icon"></div>
                                <p>All NFTs</p>
                            </div>
                        </div>
                        <div className="nft-items">
                            <p className="items-title">Detask NFT</p>
                            <div className="nft-item active">
                                <div className="item-icon"></div>
                                <p>Detask</p>
                                <p className="count">5</p>
                            </div>
                            <div className="nft-item">
                                <div className="item-icon"></div>
                                <p>Deorder</p>
                                <p className="count">5</p>
                            </div>
                        </div>
                        <div className="nft-items">
                            <div className="items-title">
                                My Collections
                                <div className="add" onClick={() => addNft()}></div>
                            </div>
                            <div className="nft-item">
                                <div className="item-icon"></div>
                                <p>101</p>
                                <p className="count">15</p>
                            </div>
                        </div>
                    </div>
                    </>
                }
            </div>
            <div className="userNfts">
                
            </div>
        </div>
    </div>
    
}