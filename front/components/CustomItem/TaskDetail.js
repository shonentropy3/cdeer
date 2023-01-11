import { FilePdfOutlined } from "@ant-design/icons";

export default function TaskDetail(params) {
    
    const { task } = params;

    return task &&
    <div className="content-container">
                <p className='task-details'>Task Details</p>
                <div className='task-detail-list'>
                    <p className='task-type task-li'>
                        <span className='task-type-title title'>Type：</span>
                        <span className='task-type-text content'>Blockchain</span>
                    </p>
                    <p className='task-cost task-li'>
                        <span className='task-cost-title title'>Cost：</span>
                        {
                            task.budget == 0 ? 
                            <span className="title-cost-price content">可报价</span>
                            :
                            <span className='task-cost-price content'>{task.budget}{task.currency}</span>
                        }
                    </p>
                    <p className='task-date task-li'>
                        <span className='task-date-title title'>Cycle：</span>
                        <span className='task-date-time content'>{task.period / 86400}days</span>
                    </p>
                </div>
                <div className="content-li">
                    <p className="li-title">Task Description：</p>
                    <div className="li-box">
                        <p className="detail content">
                            {JSON.parse(task.attachment).desc}
                        </p>
                    </div>
                </div>
                <div className="content-li">
                    <p className="li-title">Task document：</p>
                    <div className="li-box">
                        <div className="upload">
                            <p className="upload-title">{JSON.parse(task.attachment).suffix}</p>
                            {/* <p>下载</p> */}
                        </div>
                    </div>
                </div>
                <div className="content-li">
                    <p className="li-title">Skill requirements：</p>
                    <div className="li-box boxs">
                        {
                            task.role?.map((e,i) => <div className="box" key={i}>{e}</div> )
                        }
                    </div>
                </div>
            </div>
}