import { Divider, Button, Modal, InputNumber, message } from 'antd';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useContracts, useReads, useSignProData } from '../controller';
import { getHash, getProlongStage, getStagesHash, getStagesJson, updateAttachment, updateSignature } from '../http/api/order';
import { useAccount, useNetwork } from 'wagmi'

export default function Stage_inspection(props) {

    const { chain } = useNetwork();
    const { address } = useAccount();
    const { setTab } = props;
    
    const { Oid } = props;
    const { Who } = props;
    const { data } = props;
    const { index } = props;
    const { set } = props;
    const { OrderStart } = props;
    const { useOrderContractWrite: delivery } = useContracts('updateAttachment');
    const { useOrderContractWrite: confirm } = useContracts('confirmDelivery');
    const { useOrderContractWrite: prolongStage } = useContracts('prolongStage');
    const { useOrderContractWrite: abortOrder } = useContracts('abortOrder');
    // 

    const { useStageReads } = useReads('ongoingStage',[Oid])
    const { useStageReads: Stages, stageConfig } = useReads('getStages',[Oid])
    const { useStageReads: Order } = useReads('getOrder',[Oid])
    const { useOrderReads: nonces } = useReads('nonces',[address]);

    let [stageJson,setStageJson] = useState({});
    let [doingStage,setDodingStage] = useState();
    let [deliveryDetail,setDeliveryDetail] = useState(null);
    let [delayValue,setDelayValue] = useState(null);
    let [testObj,setTestObj] = useState({});
    let [nonce,setNonce] = useState();
    let [signature,setSignature] = useState();
    let [stages,setStages] = useState({});
    let [deadline,setDeadline] = useState();
    let [permitNonce,setPermitNonce] = useState();
    
    const { useSign, params, obj } = useSignProData(testObj);  //  延长签名
    
    const setDelivery = () => {
        delivery.write({
            recklesslySetUnpreparedArgs: [
                Oid, ''
            ]
        })
    }

    const setConfirmDelivery = (i) => {
        // 阶段验收
        // console.log(index);
        // console.log(useStageReads.data[0].stageIndex.toString());
        
        // console.log(stageConfig);
        // return
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
                <InputNumber addonBefore="延长天数" addonAfter="day" min={1} controls={false} onChange={e => {delayValue = e,setDelayValue(delayValue)}} />
                {/* controls */}
              </div>
            ),
        
            onOk() {
                let now = parseInt(new Date().getTime()/1000);
                let setTime = 2 * 24 * 60 * 60;
                deadline = now+setTime;
                setDeadline(deadline);
                let i = index + 1;
                testObj = {
                    chainId: chain.id,
                    // address: address,
                    orderId: Oid,
                    stageIndex: `${i}`,
                    period: `${delayValue * 24 * 60 * 60}`,
                    nonce: nonce,  
                    deadline: `${now+setTime}`,
                }
                setTestObj({...testObj})
                // console.log(delayValue,useStageReads.data[0].stageIndex.toString());
            },
          });
    }

    const sendSign = () => {
        useSign.signTypedData()
    }

    const updateSignatureData = () => {
        // console.log(deliveryDetail);
        // console.log('===>', Stages.data[0]);
        // console.log('===>', stages.period[index+1]);
        stages.period[index+1] += delayValue;
        stages.deadline = deadline;
        setStages({...stages});
        console.log(stages);
        updateSignature({signature: signature, signaddress: address, stages: JSON.stringify(stages), oid: Oid, nonce: nonce})
        .then(res => {
            // message.success('')
        })
    }

    const getDetail = async() => {
        await getStagesJson({oid: Oid})
            .then(res => {
                permitNonce = res.signnonce;
                setPermitNonce(permitNonce);
                console.log(res.signnonce);
                stages = res.stages;
                setStages({...stages});
                deliveryDetail = res.json.stages[index+1].delivery;
                setDeliveryDetail(deliveryDetail);
                stageJson = res.json;
                stageJson.last = res.attachment;
                setStageJson({...stageJson});
            })
    }

    const permitDelay = () => {
        // TODO: prolongStage contract
        getProlongStage({oid: Oid})
        .then(res => {
            if (res.code === 200) {
                let obj = {
                    _orderId: Oid, 
                    _stageIndex: index+1,
                    _appendPeriod: (data.period - data.prolong) * 24 * 60 * 60,
                    nonce: nonce,
                    deadline: res.data.stages.deadline,
                    v: '0x' + res.data.signature.substring(2).substring(128, 130),
                    r: '0x' + res.data.signature.substring(2).substring(0, 64),
                    s: '0x' + res.data.signature.substring(2).substring(64, 128)
                }
                console.log(obj._orderId, obj._stageIndex, obj._appendPeriod, permitNonce, obj.deadline, obj.v, obj.r, obj.s);
                prolongStage.write({
                    recklesslySetUnpreparedArgs: [obj._orderId, obj._stageIndex, obj._appendPeriod, permitNonce, obj.deadline, obj.v, obj.r, obj.s]
                })
            }
        })
    }

    const abort = () => {
        // console.log(Oid);
        // console.log(Stages.data[0]);
        // console.log(useStageReads.data[0]);
        // ongoingStage
        // return
        abortOrder.write({
            recklesslySetUnpreparedArgs: [Oid]
        })
    }

    useEffect(() => {
        if (abortOrder.isSuccess) {
            console.log(abortOrder.data);
        }
        if (abortOrder.isError) {
            console.log(abortOrder.error);
        }
    },[abortOrder.isSuccess])

    useEffect(() => {
        if (prolongStage.isSuccess) {
            message.success('阶段延期成功')
        }
        if (prolongStage.error) {
            console.log(prolongStage.error);
        }

    },[prolongStage])

    useEffect(() => {
        if (useSign.data) {
            signature = useSign.data;
            setSignature(signature);
            updateSignatureData();
        }
    },[useSign.data])

    useEffect(() => {
        obj.chainId ? 
            sendSign()
            :
            ''
    },[params])

    useEffect(() => {
        if (useSign.error) {
            console.log(useSign.error);
        }
    },[useSign.error])

    useEffect(() => {
        if (nonces.data) {
            nonce = nonces.data.toString();
            setNonce(nonce);
        }
    },[nonces.data])

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
        if (!deliveryDetail) {
            getDetail()
        }
    },[])

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
                }
                {
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
                }
            </div>
        </div>
    )
}