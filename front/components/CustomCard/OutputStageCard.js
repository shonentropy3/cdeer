import { message } from "antd";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useContracts, useRead, useSignProData } from "../../controller";
import { updatedStage } from "../../http/_api/order";
import StageOutput from "../CustomItem/StageOutput";
import ProlongModal from "../CustomModal/ProlongModal";



export default function OutputStageCard(params) {
    
    const { edit, remove, cache, isEdit, data, stageIndex, who, oid, task, order } = params;
    const { chain } = useNetwork();
    const { address } = useAccount();

    let [list, setList] = useState([]);

    let [isProlong, setIsProlong] = useState(false);
    let [prolongObj,setProlongObj] = useState({});  //  延长签名
    let [prolongReady, setProlongReady] = useState(false);
    const { useSign: prolongSign, obj: prolongConfig } = useSignProData(prolongObj);  //  延长签名

    let [isLoading, setIsLoading] = useState(false);
    let [activeIndex, setActiveIndex] = useState();
    let [deadline, setDeadline] = useState();
    

    const { useOrderRead: nonces } = useRead('nonces', address);
    const { useOrderContractWrite: updateAttachment } = useContracts('updateAttachment');
    const { useOrderContractWrite: confirmAttachment } = useContracts('confirmDelivery');

    // 请求返回处理
    const handelRes = (res) => {
        if (res.code === 0) {
            message.success(res.msg)
            setTimeout(() => {
                history.go(0)
            }, 500);
        }else{
            message.error(res.msg)
        }
    }

    // 提交阶段交付
    const updateDelivery = () => {
        // 上链

        return
        updateAttachment.write({
            recklesslySetUnpreparedArgs: [Number(oid), '']
        })
    }

    // 确认阶段交付
    const confirmDelivery = () => {
        // 上链

        return
        confirmAttachment.write({
            recklesslySetUnpreparedArgs: [Number(oid), Number(stageIndex)]
        })
    }

    // 发起阶段延长
    const updateProlong = (period) => {
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

    return <>
    {
        isProlong && <ProlongModal close={setIsProlong} prolong={updateProlong} loading={isLoading}  />
    }
    <div className="items">
        {
            list.map((e,i) => 
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
                        updateDelivery={updateDelivery}
                        confirmDelivery={confirmDelivery}
                        updateProlong={setIsProlong}
                        confirmProlong={confirmProlong}
                        rejectProlong={rejectProlong}

                        Order={order}
                    />
                </div>
            )
        }
    </div>
    </>
}