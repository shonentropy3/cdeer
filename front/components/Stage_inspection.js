import { Divider, Button, Modal, InputNumber, message } from 'antd';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useContracts, useReads } from '../controller';
import { getHash, getStagesHash, getStagesJson, updateAttachment } from '../http/api';

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
    const { useStageReads: Stages, stageConfig } = useReads('getStages',[Oid])
    const { useStageReads: Order } = useReads('getOrder',[Oid])

    let [stageJson,setStageJson] = useState({});
    let [doingStage,setDodingStage] = useState();
    let [deliveryDetail,setDeliveryDetail] = useState();
    
    const setDelivery = () => {
        delivery.write({
            recklesslySetUnpreparedArgs: [
                Oid, ''
            ]
        })
    }

    const setConfirmDelivery = (i) => {
        // 阶段验收
        console.log(index);
        console.log(useStageReads.data[0].stageIndex.toString());
        console.log(Stages.data[0]);
        // console.log(stageConfig);
        return
        confirm.write({
            recklesslySetUnpreparedArgs: [
                Oid, [`${i}`]
            ]
        })
    }

    const deliveryHash = () => {
        // TODO: 乙方成功后,更新数据库stageJson ==> 
        stageJson.stages[index+1].delivery.attachment = '';
        stageJson.stages[index+1].delivery.fileType = '';
        stageJson.stages[index+1].delivery.content = '阶段一完成';
        setStageJson({...stageJson});
        updateAttachment({oid: Oid, obj: JSON.stringify(stageJson)})
        .then(res => {
            message.success('交付成功!')
        }).catch(err => {
            message.error('交付失败!')
        })
    }

    const delay = () => {
        Modal.info({
            title: '申请延期',
            content: (
              <div>
                <p>延期不回增加开发费用</p>
                <p>请提前与对方沟通</p>
                <InputNumber addonBefore="延长天数" addonAfter="day" min={1} controls={false} />
                {/* controls */}
              </div>
            ),
        
            onOk() {
                console.log('hh');
            },
          });
    }

    useEffect(() => {
        if (useStageReads.isSuccess && useStageReads.data[0] !== null) {
            doingStage = useStageReads.data[0].stageIndex.toString();
            setDodingStage(doingStage);
        }
    },[useStageReads.isSuccess])

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

    useEffect(() => {
        if (Oid) {
            // TODO: 获取stagejson ==> delivery
            getStagesJson({oid: Oid})
            .then(res => {
                deliveryDetail = res.json.stages[index+1].delivery;
                setDeliveryDetail(deliveryDetail);
                stageJson = res.json;
                stageJson.last = res.attachment;
                setStageJson({...stageJson});
            })
        }
    },[Oid])

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
                        ''
                }
                {
                    doingStage == index + 1 && OrderStart ? 
                        <span style={{width: '100%', textAlign: 'right', color: '#f9b65c'}}>进行中</span>
                        :
                        ''
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
                    doingStage == index + 1 && !Who && deliveryDetail.content ? 
                    <div className="deliveryDetail">
                        <div className="title">开发者提交了「阶段交付」:</div>
                        <div className="content">
                            {deliveryDetail.content}
                        </div>
                    </div>
                    :
                    ''
                }
                {
                    doingStage == index + 1 ? 
                        <div className="btns">
                            <Button onClick={() => delay()}>延期</Button>
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