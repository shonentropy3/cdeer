import { Divider, Button } from 'antd';
import { ethers } from 'ethers';
import { useEffect } from 'react';
import { useContracts, useReads } from '../controller';

export default function Stage_inspection(props) {

    const { setTab } = props;
    const { Oid } = props;
    const { Who } = props;
    const { data } = props;
    const { index } = props;
    const { set } = props;
    const { OrderStart } = props;
    const { useOrderContractWrite: delivery } = useContracts('updateAttachment');
    const { useOrderContractWrite: confirm } = useContracts('confirmDelivery');
    const { useStageReads } = useReads('ongoingStage',[Oid])
    const { useStageReads: Stages } = useReads('getStages',[Oid])
    
    const setDelivery = () => {
        console.log(typeof Oid);
        delivery.write({
            recklesslySetUnpreparedArgs: [
                '1', ''
            ]
        })
    }

    const setConfirmDelivery = (index) => {
        // console.log(Oid,index);
        console.log(useStageReads.data[0].stageStartDate.toString());
        console.log(Stages.data[0][1].amount.toString() / Math.pow(10,18));
        console.log(Stages.data[0][1]);
        return
        confirm.write({
            recklesslySetUnpreparedArgs: [
                Oid, [`${index}`]
            ]
        })
    }

    const deliveryHash = () => {
        console.log(delivery.data);
    }

    useEffect(() => {
        confirm.error ? 
            console.log(confirm.error)
            :
            ''
    },[confirm.error])

    useEffect(() => {
        delivery.isSuccess ? 
            deliveryHash()
            :
            ''
    },[delivery.isSuccess])

    return (
        data.period === 0 ? 
            ''
            :
            <div className="Stage_inspection">
            <div className="inspection-info">
                {
                    !OrderStart ? 
                        <>
                            <p onClick={() => {set(false), setTab(`${index}`)}}>修改阶段划分</p>
                            <p>删除</p>
                        </>
                        :
                        <span style={{width: '100%', textAlign: 'right', color: '#f9b65c'}}>进行中</span>
                }
                
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
                {
                    OrderStart ? 
                        <div className="btns">
                            <Button>延期</Button>
                            <Button>中止</Button>
                            {
                                Who ? <Button onClick={() => setDelivery()}>确认交付</Button> : <Button onClick={() => setConfirmDelivery(index+1)}>确认验收</Button>
                            }
                        </div>
                        :
                        ''
                }
            </div>
        </div>
    )
}