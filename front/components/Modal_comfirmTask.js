import { Button } from 'antd';

export default function Modal_comfirmTask(params) {
    
    const { comfirm } = params


    return <>
        <p className="modal-title"> 确认发布项目 </p>
            <div className="modal-info">
                <div className="info-full">
                    <p className="title">项目详情</p>
                    <div className="content">XDAO运维+数据系统开发</div>
                </div>
                <div className="info-full">
                    <p className="title">项目类型</p>
                    <div className="content">区块链</div>
                </div>
                <div className="info-full info-half">
                    <div>
                        <p className="title">项目预算</p>
                        <div className="content">10 ETH</div>
                    </div>
                    <div>
                        <p className="title">项目周期</p>
                        <div className="content">20天</div>
                    </div>
                </div>
                <div className="info-full">
                    <p className="title">项目描述</p>
                    <div className="content">后台需要一套前端系统来支持数据维护，权限维护，爬虫任务状态控制等工作。后台需要一套前端系统来支持数据维护，权限维护，爬虫任务状态控制等工作。后台需要一套前端系统来支持数据维护，权限维护，爬虫任务状态控制等工作。</div>
                </div>
                <div className="info-full">
                    <p className="title">项目文档</p>
                    <div className="content">xxxx</div>
                </div>
                <div className="info-full">
                    <p className="title">技能要求</p>
                    <div className="content"></div>
                </div>
                <Button className="btn" type="primary" onClick={() => comfirm()}>确认发布</Button>
            </div>
    </>
}