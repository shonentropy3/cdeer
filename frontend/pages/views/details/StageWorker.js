import { Button, message } from "antd";
import { useEffect, useState } from "react"
import { orderStage, withdraw } from "../../../controller/order";
import { checkWalletIsConnected } from "../../../utils/checkWalletIsConnected";
import getOrderStatus from "../../../utils/getOrderStatus";

export default function StageWorker() {
    
    let [oid,setOid] = useState('');
    let [task_id,setTask_id] = useState('');
    let [arr,setArr] = useState([])

    const getOid = async() => {
        let obj = {
            demand_id: task_id,
            apply_addr: await checkWalletIsConnected()
        };
        obj = JSON.stringify(obj);
        await getOrderStatus(obj)
        .then(res => {
            oid = res.oid;
            setOid(oid);
            getStage()
        })
    }

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

    const getStage = async() => {
        await orderStage(oid)
        .then(res => {
            res.forEach((e,i) => {
                
                let price = Number(e[0].toString()) / 1000000000000000000;

                arr[i] = {
                    price: price,
                    date: getDate(e[4].toString()),
                    dsc: e[1],
                    withdrawed: e[3]
                }
            })
            setArr([...arr])
        })
    }

    const getWithdraw = async(i) => {
        let obj = {
            orderId: oid,
            stageIndex: i
        }
        obj = JSON.stringify(obj);
        await withdraw({proLabel: obj})
        .then(res => {
            if (res.code == 200) {
                message.success('提款成功!')
            }else{
                message.success('提款失败!')
            }

        })
        console.log(i);
    }
    
    useEffect(() => {
        task_id = location.search.replace('?','');
        setTask_id(task_id);
        getOid();
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
                             {/* bottom需以订单状态来判断是否显示 */}
                             <div className="bottom">
                                <div className="l">
                                    需求方发起了...
                                </div>
                                <div className="r">
                                    {
                                        e.withdrawed ? <Button disabled>已提款</Button> : <Button type="primary" onClick={() => getWithdraw(i)}>阶段{i+1}提款</Button>
                                    }
                                </div>
                             </div>
                        </div> )
                }
            </div>
        </div>
}