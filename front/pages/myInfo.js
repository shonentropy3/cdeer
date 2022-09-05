import { Button } from 'antd';
import {
    WechatOutlined,
    SkypeOutlined,
    GithubOutlined
  } from '@ant-design/icons';

export default function myInfo() {
    
    return <div className="MyInfo">
        <div className="myInfo-top">
            <div className="top">
                <div className="img"></div>
                <div className="info">
                    <p>Tony-001</p>
                    <div className="li"><SkypeOutlined /><WechatOutlined /><GithubOutlined /></div>
                </div>
            </div>
            <Button className="btn">编辑个人资料</Button>
        </div>
        <div className="myInfo-bottom">
            <p className="bg">擅长技能</p>
            <Button className="btn">添加擅长的技能</Button>
        </div>
    </div>
}