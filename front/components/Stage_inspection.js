import { Divider } from 'antd';

export default function Stage_inspection(props) {

    const { setTab } = props;
    const { data } = props;
    const { index } = props;
    const { set } = props;

    
    return (
        <div className="Stage_inspection">
            <div className="inspection-info">
                <p onClick={() => {set(false), setTab(`${index}`)}}>修改阶段划分</p>
                <p>删除</p>
            </div>
            <div className="inspection-nav">
                P{index+1}阶段<Divider type="vertical" className="line" />{data.title}
            </div>
            <div className="inspection-content">
                <div className="box">
                    <p>交付时长</p>
                    <p>{data.period}天</p>
                </div>
                <div className="box">
                    <p>阶段费用</p>
                    <p>{data.budget}ETH</p>
                </div>
                <div className="box">
                    <p>交付说明</p>
                    <p>{data.content}</p>
                </div>
            </div>
        </div>
    )
}