export default function TaskNav(params) {
    
    const { task } = params;

    return task &&
    <div className="worker-title">
        <div className="title-info">
            <strong className="title-info-head">{task.title}</strong>
            <p className="title-info-role">Recruitment type: {
                task.role?.map((e,i)=>(
                    <span className="title-info-role-li" key={i}>{e}</span>
                ))
            }</p>
            <div>
                <p className="title-info-cycle">cycle: <span className="title-info-cycle-date">{task.period / 24 / 60 / 60}天</span> </p>
            </div>
        </div>
        <div className="title-cost">
            <p className="title-cost-line">cost: 
            {
                task.budget == 0 ? 
                <span className="title-cost-price">可报价</span>
                :
                <span className="title-cost-price">{task.budget}{task.currency}</span>
            }
            </p>
        </div>
    </div>
}