import { message } from "antd";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useContracts, useRead, useSignProData } from "../../controller";
import { startOrder, updatedStage } from "../../http/_api/order";
import StageOutput from "../CustomItem/StageOutput";
import DeliveryModal from "../CustomModal/DeliveryModal";
import ProlongModal from "../CustomModal/ProlongModal";



export default function OutputStageCard(params) {
    
    const { edit, remove, cache, isEdit, data, stageIndex, who, oid, task, order, agreeAppend, payAppend } = params;
    const { chain } = useNetwork();
    const { address } = useAccount();

    let [list, setList] = useState([]);
    
    let [isDelivery, setIsDelivery] = useState(false);  //  交付弹窗
    let [deliveryObj, setDeliveryObj] = useState({});

    let [isProlong, setIsProlong] = useState(false);
    let [prolongObj,setProlongObj] = useState({});  //  延长签名
    let [prolongReady, setProlongReady] = useState(false);
    const { useSign: prolongSign, obj: prolongConfig } = useSignProData(prolongObj);  //  延长签名

    let [isLoading, setIsLoading] = useState(false);
    let [activeIndex, setActiveIndex] = useState();
    let [deadline, setDeadline] = useState();
    let [going, setGoing] = useState(false);
    

    const { useDeOrderVerifierRead: nonces } = useRead('nonces', address);
    // 交付
    const { useOrderContractWrite: updateAttachment } = useContracts('updateAttachment');
    // 确认交付
    const { useOrderContractWrite: confirmAttachment, test } = useContracts('confirmDelivery');
    // 延期
    const { useOrderContractWrite: prolongStage } = useContracts('prolongStage');
    // 领钱
    const { useOrderContractWrite: getWithdraw } = useContracts('withdraw');
    // 终止
    const { useOrderContractWrite: abortOrder } = useContracts('abortOrder');
    
    

    // 请求返回处理
    const handelRes = (res) => {
        if (res.code === 0) {
            message.success(res.msg)
            setTimeout(() => {
                history.go(0)
            }, 500);
        }else{
            message.error(res.msg)
            setIsLoading(false)
            // setGoing(false)  
        }
    }

    // 领钱
    const withdraw = () => {
        setIsLoading(true);
        getWithdraw.write({
            recklesslySetUnpreparedArgs: [Number(oid), address]
        })
    }

    // 终止
    const abort = () => {
        setIsLoading(true);
        abortOrder.write({
            recklesslySetUnpreparedArgs: [Number(oid)]
        })
    }

    // 提交阶段交付
    const updateDelivery = (e) => {
        setIsLoading(true);
        deliveryObj = e;
        setDeliveryObj({...deliveryObj})

        // 上链 ==> 更新数据库
        updateAttachment.write({
            recklesslySetUnpreparedArgs: [Number(oid), e.attachment]
        })
    }
    const updateAttachmentSuccess = (hash) => {
        order.stage_json.stages[stageIndex].delivery = deliveryObj;

        updatedStage({
            obj: JSON.stringify(order.stage_json),
            order_id: oid,
            hash: hash
            // status: "IssuerAgreeStage"
        })
        .then(res => {
            handelRes(res)
        })
    }

    // 确认阶段交付
    const confirmDelivery = () => {
        // 上链 ==> 更新数据库
        console.log(Number(oid), Number(stageIndex));
        setIsLoading(true);
        confirmAttachment.write({
            recklesslySetUnpreparedArgs: [Number(oid), [Number(stageIndex)]]
        })
    }
    const confirmAttachmentSuccess = (hash) => {
        updatedStage({
            order_id: oid,
            hash: hash,
            status: "IssuerAgreeStage"
        })
        .then(res => {
            handelRes(res)
        })
    }

    // 发起阶段延长
    const updateProlong = (period) => {
        if (order.status === 'WaitAppendAgree') {
            message.warning('请先确认「新增申请」')
            return
        }
        setIsLoading(true);

        let now = parseInt(new Date().getTime()/1000);
        let setTime = 2 * 24 * 60 * 60;
        deadline = now+setTime;
        setDeadline(deadline);
        prolongObj = {
            chainId: chain?.id,
            orderId: oid,
            stageIndex: activeIndex,
            period: `${period * 24 * 60 * 60}`,
            nonce: Number(nonces.data.toString()),
            deadline: deadline,
        }
        setProlongObj({...prolongObj});
        setProlongReady(true);
    }

    // 确认阶段延长
    const confirmProlong = () => {
        setIsLoading(true)
        const prolongValue = (order.last_stages.period[stageIndex] - order.stages.period[stageIndex]) * 24 * 60 * 60
        const r = '0x' + order.signature.substring(2).substring(0, 64);
        const s = '0x' + order.signature.substring(2).substring(64, 128);
        const v = '0x' + order.signature.substring(2).substring(128, 130);
        prolongStage.write({
            recklesslySetUnpreparedArgs: [oid, stageIndex, prolongValue, order.sign_nonce, order.last_stages.deadline, v, r, s]
        })
    }

    // 拒绝阶段延长
    const rejectProlong = () => {
        updatedStage({
            order_id: oid,
            status: 'DisagreeProlong'
        })
        .then(res => {
            handelRes(res)
        })
    }

    // 确认新增阶段
    const confirmAppend = async() => {
        setIsLoading(true);
        // 判断是谁
        if (who === 'issuer') {
            // 直接付款
            await payAppend()
        }else{
            // 签名
            await agreeAppend()
        }
        setIsLoading(false);
    }

    // 拒绝阶段新增
    const rejectAppend = () => {
        updatedStage({
            order_id: oid,
            status: 'DisagreeAppend'
        })
        .then(res => {
            handelRes(res)
        })
    }

    // 更新阶段
    const update = (obj,signature,status) => {
        // 判断数据库stagejson.stages ? obj 长度是否一致
        if (order.stage_json.stages.length !== obj.length) {
            // stages添加阶段
            order.stage_json.stages.push({
                milestone: {
                    type: 'raw',
                    content: obj[obj.length-1].desc,
                    title: obj[obj.length-1].name
                },
                delivery: {
                    attachment: '',
                    fileType: '',
                    content: ''
                }
            })
        }

        order.stages.amount = [];
        order.stages.period = [];
        order.stages.deadline = deadline;
        obj.map(e => {
            order.stages.amount.push(e.amount);
            order.stages.period.push(e.period);
        })
        
        updatedStage({
            signature: signature,
            sign_address: address,
            sign_nonce: Number(nonces.data.toString()),
            obj: JSON.stringify(order.stage_json),
            order_id: oid,
            stages: JSON.stringify(order.stages),
            status: status
        })
        .then(res => {
            handelRes(res)
        })
    }

    useEffect(() => {
        if (cache) {
            let arr = [];
            let deliveryDate = 0;
            for (const i in cache) {
                let obj = cache[i];
                deliveryDate += obj.period;
                arr.push({
                    name: obj.name,
                    desc: obj.desc,
                    amount: obj.amount,
                    period: obj.period,
                    deliveryDate: deliveryDate
                })
            }
            list = arr;
            setList([...list]);
        }
    },[cache])

    useEffect(() => {
        if (data && list.length === 0) {
            list = data;
            setList([...list]); 
        }
    },[data])

    // 发起签名
    useEffect(() => {
        if (prolongConfig.chainId && prolongReady) {
            prolongSign.signTypedDataAsync()
            .then(res => {
                let obj = data;
                obj[prolongObj.stageIndex].period += prolongObj.period / (24 * 60 * 60)
                update(obj, res, 'WaitProlongAgree')
                // 修改data ==> 上传后端更新
            })
            .catch(err => {
                setIsLoading(false)
            })
        }
    },[prolongObj])

    // 确认延期成功
    useEffect(() => {
        if (prolongStage.isSuccess) {
            updatedStage({
                hash: prolongStage.data.hash,
                status: 'AgreeProlong'
            })
            .then(res => {
                handelRes(res);
            })
        }
        if (prolongStage.error) {
            message.error('error');
            setIsLoading(false);
        }
    },[prolongStage])

    // 提交交付成功
    useEffect(() => {
        if (updateAttachment.data) {
            // 更新数据库
            updateAttachmentSuccess(updateAttachment.data.hash)
        }
    },[updateAttachment.data])

    useEffect(() => {
        if (updateAttachment.isError) {
            message.error('error')
            setIsLoading(false);
        }
    },[updateAttachment.error])

    // 确认交付成功
    useEffect(() => {
        if (confirmAttachment.isSuccess) {
            // 更新数据库
            confirmAttachmentSuccess(confirmAttachment.data.hash)
        }
        if (confirmAttachment.error) {
            message.error('error')
            setIsLoading(false);
        }
    },[confirmAttachment])

    // 领钱成功
    useEffect(() => {
        if (getWithdraw.isSuccess) {
            message.success("操作成功")
            setIsLoading(false);
            startOrder({
                order_id: order.order_id
            })
            .then(res => {
                handelRes(res)
            })
        }
        if (getWithdraw.error) {
            message.error('error')
            setIsLoading(false);
        }
    },[getWithdraw])
    
    // 终止成功
    useEffect(() => {
        if (abortOrder.isSuccess) {
            message.success("操作成功")
            setIsLoading(false);
            startOrder({
                order_id: order.order_id
            })
            .then(res => {
                handelRes(res)
            })
        }
        if (abortOrder.error) {
            message.error('error')
            setIsLoading(false);
        }
    },[abortOrder])

    return <>
    {
        isDelivery && <DeliveryModal close={setIsDelivery} updateDelivery={updateDelivery} loading={isLoading} stageIndex={stageIndex} />
    }
    {
        isProlong && <ProlongModal close={setIsProlong} prolong={updateProlong} loading={isLoading}  />
    }
    <div className="items">
        {
            list.map((e,i) => 
            e.period !== 0 &&
                <div className="stageItem" key={i}>
                    <StageOutput 
                        data={e} 
                        index={i} 
                        edit={edit} 
                        remove={remove} 
                        isEdit={isEdit} 
                        ongoing={data ? true : false} 
                        stageIndex={stageIndex} 
                        who={who}
                        status={order?.status}
                        sign_address={order?.sign_address}
                        address={address}

                        setActiveIndex={setActiveIndex}
                        updateDelivery={setIsDelivery}
                        confirmDelivery={confirmDelivery}

                        updateProlong={setIsProlong}
                        confirmProlong={confirmProlong}
                        rejectProlong={rejectProlong}

                        rejectAppend={rejectAppend}
                        confirmAppend={confirmAppend}

                        withdraw={withdraw}

                        abort={abort}

                        Order={order}
                        loading={isLoading}
                    />
                </div>
            )
        }
    </div>
    </>
}