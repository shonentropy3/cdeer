import { useEffect, useState } from "react";
import StageOutput from "../CustomItem/StageOutput";



export default function OutputStageCard(params) {
    
    const { add, cache } = params;

    let [list, setList] = useState([]);


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

    return <>
    <div className="items">
        {
            list.map((e,i) => 
                <div className="stageItem" key={i}>
                    <StageOutput data={e} index={i} />
                </div>
            )
        }
    </div>
    </>
}