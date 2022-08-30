import { Button, message } from "antd";
import { useEffect, useState } from "react"
import { orderStage, withdraw } from "../../../controller/order";
import { checkWalletIsConnected } from "../../../utils/checkWalletIsConnected";
import getOrderStatus from "../../../utils/getOrderStatus";
import { useSelector } from 'react-redux'
import {
    useAccount,
    useDisconnect,
  } from 'wagmi'
import { useContracts, useContractsRead } from "../../../controller";
export default function StageWorker() {
    
    let [oid,setOid] = useState('');
    let [task_id,setTask_id] = useState('');
    let [arr,setArr] = useState([])
    const { address, connector, isConnected } = useAccount()
    const { useOrderContractRead: getOid } = useContractsRead('applyOrderIds',[task_id, address])
    const { useOrderContractRead: getStages } = useContractsRead('getOrderStages',oid)
    const { useOrderContractWrite: withdraw } = useContracts('withdraw')

    // withdraw
    useEffect(() => {
        if (getOid.data !== undefined) {
            oid = getOid.data.toString();
            setOid(oid)
        }
    },[task_id])

    useEffect(() => {
        if (getStages.data !== undefined) {
            getStages.data.forEach((e,i) => { 
                
                let price = Number(e.amount.toString()) / 1000000000000000000;

                arr[i] = {
                    price: price,
                    date: getDate(e[4].toString()),
                    dsc: e[1],
                    withdrawed: e[3]
                }
            })
            setArr([...arr])
            console.log(arr);
        }
    },[oid])

    const getDate = (params) => {
        var date = new Date(params * 1000);  // 参数需要毫秒数，所以这里将秒数乘于 1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds();
        return Y+M+D+h+m+s
    }

    const getWithdraw = async(i) => {
        withdraw.write({
            recklesslySetUnpreparedArgs:[ oid, i ]
        })
    }

    const writeSuccess = () => {
        message.success('提款成功!')   
        setTimeout(() => {
            history.go(0)
        }, 1000);
    }

    useEffect(() => {
        withdraw.isSuccess ? 
            writeSuccess()
            :
            ''
    },[withdraw.isSuccess])
    
    useEffect(() => {
        async function init() {
            task_id = location.search.replace('?','');
            setTask_id(task_id);
        }
        init()
    },[])

    return <div className="StageContainer">
            <div className="list">
                {
                    arr.map((e,i) => 
                        <div className="box" key={i}>            
                             <div className="nav">
                                <p>P{i+1}阶段</p>
                             </div>
                             <div className="panel">
                                <div>阶段金额 <p>{e.price}$</p></div>
                                <div>计划交付日期 <p>{e.date}</p></div>
                                <div>阶段简述 <p>{e.dsc}</p></div>
                             </div>
                             <div className="bottom">
                                <div className="l">
                                    需求方发起了...
                                </div>
                                <div className="r">
                                    {
                                        e.withdrawed ? <Button disabled>已提款</Button> : <Button type="primary" disabled={withdraw.isLoading} onClick={() => getWithdraw(i)}>阶段{i+1}提款</Button>
                                    }
                                </div>
                             </div>
                        </div> )
                }
            </div>
        </div>
}