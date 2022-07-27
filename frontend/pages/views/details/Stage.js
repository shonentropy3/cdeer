import { useEffect, useState } from "react";
import getOrderStatus from "../../../utils/getOrderStatus";
import { withRouter } from 'next/router'
import { orderStage } from "../../../controller/order";
import { Button, message } from "antd";
import { confirmOrder } from "../../../utils/stages";

function OrderDetail({router}) {

    let [address,setAddress] = useState('');
    let [task_id,setTask_id] = useState();
    let [oid,setOid] = useState('');
    let [arr,setArr] = useState([])
    
    
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

    const getDate = (params) => {
        var date = new Date(params * 1000);  // 参数需要毫秒数，所以这里将秒数乘于 1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds();
        return Y+M+D+h+m+s
    }

        // return
        await orderStage(oid)
        .then(res => {
            res.forEach((e,i) => {
                arr[i] = {
                    price: Number(e[0].toString()) / 1000000000000000000,
                    date: getDate(e[4].toString()),
                    dsc: e[1]
                }
            })
            setArr([...arr])
            console.log(arr,'arr==>');
        })

    }

    const confirmOrd = async() => {
        await confirmOrder(oid)
        .then(res => {
            if (res.code == 200) {
                message.success('确认订单成功')
                setTimeout(() => {
                    history.go(0)
                }, 1000);
            }else{
                message.error('确认订单失败')
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
        <div className="container">
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
                                    <Button>拒绝申请</Button>
                                    <Button type="primary">通过申请</Button>
                                </div>
                             </div>
                        </div> )
                }
            </div>
        </div>
       
    </div>
}

export default withRouter(OrderDetail)