import { Button, Divider, InputNumber, message, Modal } from "antd";
import { useEffect, useState } from "react";
import { multicallWrite, muticallEncode, useContracts, useRead, useSignProData } from "../controller";
import { getProlongStage, getStagesJson, updateSignature } from "../http/api/order";
import { updateAttachment } from "../http/api/task";
import { useNetwork, useAccount } from 'wagmi'
import { ethers } from "ethers";

export default function Stage_list(props) {
    
    const { confirm: modalComfirm } = Modal;
    const { chain } = useNetwork();
    const { address } = useAccount()
    const { data, stages, set, setTab, Query, Step, index, del, delivery, confirm, abortOrder, prolongStage, modifyAppend, pay, permitApeend, permitNonce, Attachment } = props;
    const { useStageRead: ongoingStage } = useRead('ongoingStage', Query.oid);
    const { useStageRead: stagesChain } = useRead('getStages', Query.oid);
    const { useOrderRead: nonces } = useRead('nonces', address);

    let [delayValue,setDelayValue] = useState(null);
    let [stageIndex,setStageIndex] = useState();
    let [stageJson,setStageJson] = useState();
    let [deadline,setDeadline] = useState();
    let [nonce,setNonce] = useState();
    
    let [delayObj,setDelayObj] = useState({});  //  延长签名
    let [isSigner,setIsSigner] = useState(false);   //  签名flag
    
    let [isDelivery,setIsDelivery] = useState({data: '', status: false});
    const [isAbortModalOpen, setIsAbortModalOpen] = useState(false);
    const { useSign, obj } = useSignProData(delayObj);  //  延长签名
    
    const { useOrderContractWrite: useAppendStage } = useContracts('appendStage');
    
    // 交付
    const setDelivery = () => {
        // TODO: attachment添加附件
        delivery.write({ recklesslySetUnpreparedArgs: [ Query.oid, '' ] });
    }

    // 验收
    const setConfirmDelivery = () => {
        confirm.write({ recklesslySetUnpreparedArgs: [ Query.oid, [ongoingStage.data.stageIndex.toString()] ] })
    }

    // 中止
    const abort = () => {
        abortOrder.write({ recklesslySetUnpreparedArgs: [Query.oid] })
    }
    
    // 提交延期
    const delay = () => {
        Modal.info({
            title: '申请延期',
            content: (
              <div>
                <p>延期不回增加开发费用</p>
                <p>请提前与对方沟通</p>
                <InputNumber addonBefore="延长天数" addonAfter="day" min={1} controls={false} onChange={e => {delayValue = e,setDelayValue(delayValue)}} />
              </div>
            ),
            onOk() {
                let now = parseInt(new Date().getTime()/1000);
                let setTime = 2 * 24 * 60 * 60;
                deadline = now+setTime;
                setDeadline(deadline);
                delayObj = {
                    chainId: chain.id,
                    orderId: Query.oid,
                    stageIndex: ongoingStage.data.stageIndex.toString(),
                    period: `${delayValue * 24 * 60 * 60}`,
                    nonce: nonce,
                    deadline: deadline,
                }
                setDelayObj({...delayObj})
                setIsSigner(true);
            },
          });
    }

    // 确认延期
    const permitDelay = () => {
        // TODO: prolongStage contract
        getProlongStage({oid: Query.oid})
        .then(res => {
            if (res.code === 200) {
                let obj = {
                    _orderId: Query.oid, 
                    _stageIndex: ongoingStage.data.stageIndex.toString(),
                    _appendPeriod: (data.prolongStage - data.period) * 24 * 60 * 60,
                    deadline: res.data.stages.deadline,
                    v: '0x' + res.data.signature.substring(2).substring(128, 130),
                    r: '0x' + res.data.signature.substring(2).substring(0, 64),
                    s: '0x' + res.data.signature.substring(2).substring(64, 128)
                }
                prolongStage.write({
                    recklesslySetUnpreparedArgs: [obj._orderId, obj._stageIndex, obj._appendPeriod, permitNonce, obj.deadline, obj.v, obj.r, obj.s]
                })
            }
        })
    }

    const stageStatus = () => {
        switch (data.status) {
            case 0:
                if (index == stageIndex) {
                    return <span style={{width: '100%', textAlign: 'right', color: '#f9b65c'}}>进行中</span>
                }else {
                    return ''
                }
            case 1:
                return <span style={{width: '100%', textAlign: 'right', color: 'green'}}>已完成</span>
            case 2:
                return <span style={{width: '100%', textAlign: 'right', color: 'red'}}>已中止</span>
            case 3:
                return <span style={{width: '100%', textAlign: 'right', color: '#f9b65c'}}>已取款</span>
            default:
                return 
        }
    }

    const showConfirm = () => {
        modalComfirm({
          title: '通过延期?',
          content: '同意对方发起的延期申请!',
          onOk() {
            permitDelay();
          },
          onCancel() {},
        });
    };

    const showAppendConfirm = () => {
        modalComfirm({
            title: '同意新增',
            content: '同意对方发起的新增阶段申请!',
            onOk() {
                permitApeend();
            },
            onCancel() {},
          });
    }

    const showAppendPayConfirm = () => {
        modalComfirm({
            title: '同意新增',
            content: '同意对方发起的新增阶段申请,并付款.',
            onOk() {
                pay();
            },
            onCancel() {},
          });
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
        if (Step === 1 && ongoingStage.data) {
            let index = ongoingStage.data.stageIndex.toString();
            let isStage0 = stagesChain.data[0].period.toString();
            stageIndex = isStage0 == 0 ? Number(index) - 1 : index;
            setStageIndex(stageIndex);
        }
    },[ongoingStage.data])

    useEffect(() => {
        // getStagesJson({oid: Query.oid})
            // .then(res => {
                // stages = res.stages;
                // setStages({...stages});
                // deliveryDetail = res.json.stages[index+1].delivery;
                // setDeliveryDetail(deliveryDetail);
                stageJson = Attachment;
                setStageJson({...stageJson});
            // })

    },[])

    useEffect(() => {
        if (stageJson && Step !== 0) {
            stageJson.stages?.map((e,i) => {
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

    useEffect(() => {
        abortOrder.data ? message.success('中止成功') : '';
    },[abortOrder.isSuccess])

    // 延期
    useEffect(() => {
        if (obj.chainId && isSigner) {
            useSign.signTypedData();
        }
    },[delayObj])

    useEffect(() => {
        if (useSign.data && isSigner) {
            setIsSigner(false);
            let _amounts = [];
            let _periods = [];
            stages.map(e => {
                _amounts.push(e.budget);
                _periods.push(e.period);
                // {amount:[111,111,222],"period":[0,11,2],"deadline":1665386882}
            })
            _periods[ongoingStage.data.stageIndex.toString()] += delayValue;
            console.log();
            let obj = {
                amount: _amounts, period: _periods, deadline: deadline
            }
            updateSignature({signature: useSign.data, signaddress: address, stages: JSON.stringify(obj), oid: Query.oid, nonce: nonce})
            .then(res => {
                message.success('申请成功,等待对方同意!')
            })
        }
    },[useSign.data])
    
    useEffect(() => {
        if (nonces.data) {
            nonce = nonces.data.toString();
            setNonce(nonce);
        }
    },[nonces.data])

    useEffect(() => {
        if (prolongStage.isSuccess) {
            message.success('阶段延期成功')
            setTimeout(() => {
                history.go(0);
            }, 1000);
        }
    },[prolongStage.isSuccess])

    useEffect(() => {
        if (useAppendStage.data) {
            message.success('新增阶段成功!')
            setTimeout(() => {
                history.go(0)
            }, 500);
        }
    },[useAppendStage.data])

    return  (
        data.period === 0 ? '' :
            <div className="Stage_inspection">
            <Modal title="" className="Abort" footer={null} open={isAbortModalOpen} closable={false}>
                <p className="title">中止阶段</p>
                {/* TODO: 中止阶段退款 */}
                <div className="btns">
                    <Button onClick={() => {setIsAbortModalOpen(false)}}>取消</Button>
                    <Button onClick={() => abort()}>中止阶段</Button>
                </div>
            </Modal>
            <div className="inspection-info">
                {
                    Step === 0 ? 
                        <>
                            <p onClick={() => {set(false), setTab(data.key)}}>修改阶段划分</p>
                            <p onClick={() => del(index)}>删除</p>
                        </> : ''
                }
                {/* index == stageIndex */}
                {   
                    Step !== 0 ? 
                        stageStatus() : ''
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
                    stageIndex == index && isDelivery.status && Step === 1 ? 
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
                    Step === 1 && index == stageIndex && data.status === 0  ? 
                        <div className="btns">
                            <Button type="dashed" onClick={() => delay()}>延期</Button>
                            <Button type="primary" danger onClick={() => {setIsAbortModalOpen(true)}}>中止</Button>
                            {
                                Query.who === 'worker' ? 
                                <Button type="primary" onClick={() => setDelivery()}>确认交付</Button> 
                                : 
                                <Button type="primary" onClick={() => setConfirmDelivery(index+1)}>确认验收</Button>
                            }
                        </div> : ''
                }
                
            </div>
            <div className="bottom">
            {
                data.status === 1 && Query.who === 'worker' ? 
                
                    <Button>取款</Button>
                 : ''
            }
            {/* 延期 */}
            {
                data.prolongStage && Step === 1 ? 
                <div className="prolong">
                    {data.prolongAddress === address ? 
                    '你提交了「阶段延期」，等待对方同意' 
                    : 
                    <div className="btn" style={{display: 'flex', justifyContent: 'space-between', padding: '10px'}}>
                        <p>对方申请周期延长{data.prolongStage - data.period}天</p>
                        <Button onClick={showConfirm}>同意延期</Button>
                    </div> }
                </div>:''
            }
            {/* 添加阶段 */}
            {
                data.append && Step === 1 ? 
                <div className="append">
                    {data.appendAddress === address ? 
                    <div className="btn" style={{display: 'flex', justifyContent: 'space-between', padding: '10px'}}>
                        <p>你提交了「新增阶段」，等待对方同意</p>
                        <Button onClick={() => {modifyAppend(true)}}>重新提交</Button>
                    </div>
                    : 
                    <div className="btn" style={{display: 'flex', justifyContent: 'space-between', padding: '10px'}}>
                        <p>对方发起了「新增阶段」的申请</p>
                        <div>
                        <Button onClick={() => {modifyAppend(true)}}>修改新增</Button>
                        {
                            Query.who === 'issuer' ? 
                            <Button onClick={showAppendPayConfirm}>同意新增并支付</Button>
                            :
                            <Button onClick={showAppendConfirm}>同意新增</Button>
                        }
                        </div>
                    </div> }
                </div>:''
            }
            </div>
        </div>
    )
}