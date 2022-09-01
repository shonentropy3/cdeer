import { Button } from 'antd';

export default function Header() {
    


    return <div className="Header">
        <div className="content">
            <div className="header-logo">
                <div className="img"></div>
                <p>LOGO</p>
            </div>
            <div className="header-nav">
                <div className="li li-active">
                    首页
                    <div className="line" />
                </div>
                <div className="li">
                    寻找项目
                    <div className="line" />
                </div>
            </div>
            <div className="header-info">
                <div className="img"></div>
                <Button className="btn">连接钱包</Button>
            </div>
        </div>
    </div>
}