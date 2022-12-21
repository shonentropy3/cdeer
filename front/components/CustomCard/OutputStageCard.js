import { useEffect, useState } from "react";
import { useContracts } from "../../controller";
import StageOutput from "../CustomItem/StageOutput";



export default function OutputStageCard(params) {
    
    const { edit, remove, cache, isEdit, data, stageIndex, who, oid } = params;

    let [list, setList] = useState([]);

    const { useOrderContractWrite: updateAttachment } = useContracts('updateAttachment');
    const { useOrderContractWrite: confirmAttachment } = useContracts('confirmDelivery');

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


    useEffect(() => {
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
    },[cache])

    useEffect(() => {
        if (data) {
            list = data;
            setList([...list]); 
        }
    },[data])

    return <>
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
                        updateDelivery={updateDelivery}
                        confirmDelivery={confirmDelivery}
                    />
                </div>
            )
        }
    </div>
    </>
}