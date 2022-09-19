import { useState } from 'react';
import { 
    Button,
    Modal
 } from 'antd';
import {
    WechatOutlined,
    SkypeOutlined,
    GithubOutlined
  } from '@ant-design/icons';

export default function myInfo() {

    let [skills,setSkills] = useState([
        {title:'solidity', status: false},
        {title:'solidity', status: false},
        {title:'solidity', status: false},
        {title:'solidity', status: false},
        {title:'solidity', status: false},
        {title:'solidity', status: false},
        {title:'solidity', status: false},
        {title:'solidity', status: false},
    ])
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
      setIsModalVisible(true);
    };
  
    const handleCancel = () => {
      setIsModalVisible(false);
    };
  
    
    return <>
    <div style={{height: '100px'}} ></div>
<div className="MyInfo">
        <div className="myInfo-top">
            <div className="top">
                <div className="img"></div>
                <div className="info">
                    <p>Tony-001</p>
                    <div className="li"><SkypeOutlined /><WechatOutlined /><GithubOutlined /></div>
                </div>
            </div>
            <Button className="btn" onClick={showModal}>编辑个人资料</Button>
        </div>
        <div className="myInfo-bottom">
            <p className="bg">擅长技能</p>
            <Button className="btn">添加擅长的技能</Button>
        </div>
        <Modal title="修改资料" className="Modify_personal_information" footer={null} open={isModalVisible} onCancel={handleCancel}>
            <div className="avatar"></div>
            <div className="box">
                <p className="title">姓名*</p>
                <div className="inners">
                    <div className="inner">

                    </div>
                </div>
            </div>
            <div className="box">
                <p className="title"> 社交账号(至少一个)*</p>
                <div className="inners">
                    <div className="inner"></div>
                    <div className="inner"></div>
                    
                    <div className="inner"></div>
                </div>
            </div>
            <div className="box">
                <p className="title">你擅长的技能*</p>
                <div className="list">
                    {/* TODO: usestate li */}
                    {
                        skills.map((e,i) => 
                            <div key={i} className={`li ${e.status ? 'active':''}`}>
                                {e.title}
                            </div>
                        )
                    }
                </div>
            </div>
            <Button className="btn">保存</Button>
        </Modal>
    </div>
    </>
    
}