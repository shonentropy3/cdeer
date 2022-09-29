import { Button, Divider, message } from "antd";
import { useEffect, useState } from "react";
import { useContracts, useRead } from "../controller";
import { getStagesJson } from "../http/api/order";
import { updateAttachment } from "../http/api/task";



export default function Stage_list(props) {
    
    const { data, set, setTab, Query, Step, index, del } = props;
    const { useStageRead: ongoingStage } = useRead('ongoingStage', Query.oid);
    const { useStageRead: stagesChain } = useRead('getStages', Query.oid);
    const { useOrderContractWrite: delivery } = useContracts('updateAttachment');
    let [stageIndex,setStageIndex] = useState();
    let [stageJson,setStageJson] = useState();
    let [isDelivery,setIsDelivery] = useState({data: '', status: false});
    
    const setDelivery = () => {
        // TODO: attachment添加附件
        delivery.write({ recklesslySetUnpreparedArgs: [ Query.oid, '' ] });
    }

    useEffect(() => {
        if (delivery.data) {
            stageJson.stages[ongoingStage.data.stageIndex.toString()].delivery = {
                attachment: '',
                fileType: '',
                content: '完成'
            }
            setStageJson({...stageJson});
            updateAttachment({oid: Query.oid, obj: JSON.stringify(stageJson)})
            .then(res => {
                message.success('交付成功!')
                setTimeout(() => {
                    history.go(0)
                }, 500);
            }).catch(err => {
                message.error('交付失败!')
            })
        }
    },[delivery.data])

    useEffect(() => {
        if (ongoingStage.data) {
            let index = ongoingStage.data.stageIndex.toString();
            let isStage0 = stagesChain.data[0].period.toString();
            stageIndex = isStage0 == 0 ? Number(index) - 1 : index;
            setStageIndex(stageIndex);
        }
    },[ongoingStage.data])
// TODO: 改为Stage_info传子
    useEffect(() => {
        getStagesJson({oid: Query.oid})
            .then(res => {
                // console.log(res);
                // return
                // permitNonce = res.signnonce;
                // setPermitNonce(permitNonce);
                // console.log(res.signnonce);
                // stages = res.stages;
                // setStages({...stages});
                // deliveryDetail = res.json.stages[index+1].delivery;
                // setDeliveryDetail(deliveryDetail);
                stageJson = res.json;
                stageJson.last = res.attachment;
                setStageJson({...stageJson});
            })
    },[])

    useEffect(() => {
        if (stageJson) {
            stageJson.stages.map((e,i) => {
                if (ongoingStage.data.stageIndex.toString() == i && e.delivery.content) {
                    isDelivery = {
                        status: true,
                        data: e.delivery
                    }
                    setIsDelivery({...isDelivery});
                }
            })
        }
    },[stageJson])

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
                {
                    Step === 1 && index == stageIndex ? 
                        <span style={{width: '100%', textAlign: 'right', color: '#f9b65c'}}>进行中</span> : ''
                }
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
                {
                    stageIndex == index && isDelivery.status ? 
                    <div className="deliveryDetail">
                        <>
                            <div className="title">{Query.who === 'issuer' ? '开发者': '你'}提交了「阶段交付」:</div>
                            <div className="content">
                                {isDelivery.data.content}
                                {/* TODO: 文件下载 */}
                                {/* {isDelivery.data.attachment} */}
                            </div>
                        </>
                        
                    </div>
                    :
                    ''
                }
                {
                    Step === 1 && index == stageIndex  ? 
                        <div className="btns">
                            <Button type="dashed" onClick={() => delay()}>延期</Button>
                            <Button type="primary" danger onClick={() => abort()}>中止</Button>
                            {
                                Query.who === 'worker' ? 
                                <Button type="primary" onClick={() => setDelivery()}>确认交付</Button> 
                                : 
                                <Button type="primary" onClick={() => setConfirmDelivery(index+1)}>确认验收</Button>
                            }
                        </div> : ''
                }
            </div>
        </div>
    )
}