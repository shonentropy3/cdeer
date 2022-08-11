import { useEffect, useState } from "react";
import getOrderStatus from "../../../utils/getOrderStatus";
import { withRouter } from 'next/router'
import { orderStage, confirmOrder, confirmOrderStage, terminateStage } from "../../../controller/order";
import { Button, message } from "antd";

function OrderDetail({router}) {

    let [address,setAddress] = useState('');
    let [task_id,setTask_id] = useState();
    let [oid,setOid] = useState('');
    let [arr,setArr] = useState([]);
    let [amount,setAmount] = useState(0);
    
    
    const getStage = async() => {
        let obj = {
            demand_id: task_id,
            apply_addr: `${ address }`
        }
        obj = JSON.stringify(obj)
        await getOrderStatus(obj)
        .then(res => {
            oid = res.oid;
            setOid(oid);
        })

        // return
        await orderStage(oid)
        .then(res => {
            amount = 0
            console.log(res);
            res.forEach((e,i) => {
                
                let price = Number(e[0].toString()) / 1000000000000000000;
                amount += price;

                arr[i] = {
                    price: price,
                    date: getDate(e[4].toString()),
                    dsc: e[1]
                }
            })
            setAmount(amount)
            setArr([...arr])
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

    const confirmOrd = async() => {
        let obj = {
            oid: oid,
            amount: amount
        }
        obj = JSON.stringify(obj)
        await confirmOrder({proLabel: obj})
        .then(res => {
            console.log(res);
            if (res.code == 200) {
                message.success('确认订单成功')
                setTimeout(() => {
                    history.go(-1)
                }, 1000);
            }else{
                message.error('确认订单失败')
            }
        })
    }

    const confirmStage = async(i) => {
        let obj = {
            orderId: oid,
            stageIndex: i
        }
        obj = JSON.stringify(obj)
        await confirmOrderStage({proLabel: obj})
        .then(res => {
            // console.log(res);
            if (res.code == 200) {
                message.success('阶段交付成功!')
            }else{
                message.error('阶段交付失败!')
            }
        })
    }

    const rejectStage = async(i) => {
        let obj = {
            orderId: oid,
            stageIndex: i
        }
        obj = JSON.stringify(obj)
        await terminateStage({proLabel: obj})
        .then(res => {
            // console.log(res);
            if (res.code == 200) {
                message.success('终止交付成功!');
                setTimeout(() => {
                    history.go(-1)
                }, 1000);
            }else{
                message.error('终止交付失败!');
            }
        })
    }

    useEffect(() => {
        task_id = Number(router.query.task_id);
        address = router.query.address;
        setAddress(address);
        setTask_id(task_id);
        getStage()
    },[])

    return <div className="OrderDetail">
        <div className="StageContainer">
            <div className="title">
                <Button type="primary" onClick={() => confirmOrd()}> 确认订单 </Button>
            </div>
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
                                    <Button type="primary" onClick={() => confirmStage(i)}>确认交付</Button>
                                    <Button onClick={() => rejectStage(i)} >拒绝交付</Button>
                                </div>
                             </div>
                        </div> )
                }
            </div>
        </div>
       
    </div>
}

export default withRouter(OrderDetail)