import { Input,Select,Button,message } from "antd"
import { useEffect, useState } from "react";
import { useContracts } from '../controller';
import { useAccount } from 'wagmi';

const {TextArea} = Input

export default function Modal_applyTask (params) {
   
    const [cost,setCost] = useState()

    
    // const apply = ()=>{
    //     let id = props.taskID
    //     let _cost = Number(cost)
    //     console.log(address,id,_cost);
    //     task.write({
    //         recklesslySetUnpreparedArgs:[address,id,_cost]
    //     })
    // }

    // useEffect(()=>{
    //     task.isSuccess?message.success("报名成功"):message.error("报名失败")
    // },[task.isSuccess])

    const apply = ()=>{
        params.apply(cost)
    }


    return <>
        <p>报名此项目<span>X</span></p>
        <div>
            <div>
                <div></div>
                <div>
                    <p>数据系统开发</p>
                    <p>技术要求：</p>
                    <p>项目周期：</p>
                </div>
                <div>
                    <p>项目估算：</p>
                    <p></p>
                </div>
            </div>
            <p>项目文档：</p>
        </div>
        <div>
            <p>报名信息</p>
            <div>
                <p>给出你的报价</p>
                <Input className="applyPrice" value={cost} onChange={(e)=>setCost(e.target.value)} />
                <Select
                    defaultValue="以太坊"
                >
                    <Option value="ETH">以太坊</Option>
                    <Option value="BTC">比特币</Option>
                </Select>
                <p>自我推荐</p>
                <TextArea
                    rows={4}
                ></TextArea>
            </div>
            <Button onClick={apply}>报名参与</Button>
        </div>
    </>
}

