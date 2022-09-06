import { Button } from 'antd';

export default function project(params) {
    


    return <div className="project">
        <div className="project-content">
        <div className="content-nav">
            <div className="nav-left">
                <div className="img">

                </div>
                <div className="info">
                    <p className="title">XDAO运维+数据系统开发</p>
                    <p className="skills">技术要求: <span>solidity</span> <span>javascript</span> <span>前端</span></p>
                </div>
            </div>
            <Button className="btn">报名参与</Button>
        </div>
        <div className="content-container">
            <div className="content-li">
                <p className="li-title">项目类型</p>
                <div className="li-box boxs">
                    <div className="box">solidity</div>
                    <div className="box">javascript</div>
                    <div className="box">python</div>
                </div>
            </div>
            <div className="content-list">
                <div className="list-li">
                    <p className="li-title">项目费用</p>
                    <div className="li-box">
                        <p className="detail">10ETH</p>
                    </div>
                </div>
                <div className="list-li">
                    <p className="li-title">项目周期</p>
                    <div className="li-box">
                        <p className="detail">20天</p>
                    </div>
                </div>
            </div>
            <div className="content-li">
                <p className="li-title">项目描述</p>
                <div className="li-box">
                    <p className="detail content">后台需要一套前端系统来支持数据维护，权限维护，爬虫任务状态控制等工作。后台需要一套前端系统来支持数据维护，权限维护，爬虫任务状态控制等工作。后台需要一套前端系统来支持数据维护，权限维护，爬虫任务状态控制等工作。</p>
                </div>
            </div>
            <div className="content-li">
                <p className="li-title">项目文档</p>
                <div className="li-box">
                    <div className="upload">
                        <p className="upload-title">xxx项目需求.pdf</p>
                        <p>下载</p>
                    </div>
                </div>
            </div>
            <div className="content-li">
                <p className="li-title">技能要求</p>
                <div className="li-box boxs">
                    <div className="box">solidity</div>
                    <div className="box">javascript</div>
                    <div className="box">python</div>
                </div>
            </div>

        </div>
        </div>
        <Button type="primary" className="project-btn">报名参加</Button>
    </div>
}