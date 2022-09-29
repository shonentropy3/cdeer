import { Divider } from "antd";



export default function Stage_list(props) {
    
    const { data, set, setTab, Query, Step, index, del } = props;


    return  (
        data.period === 0 ? '' :
            <div className="Stage_inspection">
            <div className="inspection-info">
                {
                    Step === 0 ? 
                        <>
                            <p onClick={() => {set(false), setTab(data.key)}}>修改阶段划分</p>
                            <p onClick={() => del(index)}>删除</p>
                        </> : ''
                }
                {/* {
                    Step === 2 && OrderStart ? 
                        <span style={{width: '100%', textAlign: 'right', color: '#f9b65c'}}>进行中</span>
                        :
                        ''
                } */}
            </div>
            <div className="inspection-nav">
                P{index+1}阶段<Divider type="vertical" className="line" />{data.title}
            </div>
            <div className="inspection-content">
                <div className="box">
                    <p>交付时长</p>
                    <p>{ data.prolong ? data.prolong : data.period } 天</p>
                </div>
                <div className="box">
                    <p>阶段费用</p>
                    <p>{data.budget}ETH</p>
                </div>
                <div className="box">
                    <p>交付说明</p>
                    <p>{data.content}</p>
                </div>
                {
                    data.prolong && doingStage == index + 1 ? 
                        <div className="deliveryDetail">
                            <div className="title">发起了「延长阶段」:</div>
                            <div className="content">
                                该阶段周期延长为{data.period}
                            </div>
                            <Button onClick={() => permitDelay()}>确认延期</Button>
                        </div>
                        :
                        ''
                }
                {/* {
                    doingStage == index + 1 && !Who && deliveryDetail !== null ? 
                    <div className="deliveryDetail">
                        {
                            deliveryDetail.content.length !== 0 ?
                            <>
                                <div className="title">开发者提交了「阶段交付」:</div>
                                <div className="content">
                                    {deliveryDetail.content}
                                </div>
                            </>
                            :
                            ''
                        }
                    </div>
                    :
                    ''
                } */}
                {/* {
                    doingStage == index + 1 ? 
                        <div className="btns">
                            <Button onClick={() => delay()}>延期</Button>
                            <Button onClick={() => abort()}>中止</Button>
                            {
                                Who ? <Button onClick={() => setDelivery()}>确认交付</Button> : <Button onClick={() => setConfirmDelivery(index+1)}>确认验收</Button>
                            }
                        </div>
                        :
                        ''
                } */}
            </div>
        </div>
    )
}