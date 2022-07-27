import { useEffect, useState } from "react";
import getOrderStatus from "../../../utils/getOrderStatus";
import { withRouter } from 'next/router'
import { orderStage } from "../../../controller/order";
import { Button } from "antd";


function OrderDetail({router}) {

    let [address,setAddress] = useState('');
    let [task_id,setTask_id] = useState();
    let [oid,setOid] = useState('');
    let [mock,setMock] = useState([
        {title: '', price: '100', date: '7', dsc: '阶段开始'},
        {title: '', price: '20', date: '4', dsc: '完成一半'},
        {title: '', price: '50', date: '3', dsc: '全部完成'}
    ])
    
    
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

        return
        await orderStage(oid)
        .then(res => {
            console.log(res,'==>');
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
                <Button type="primary"> 通过申请 </Button>
            </div>
            <div className="list">
                {
                    mock.map((e,i) => 
                        <div className="box" key={i}>            
                             <div className="nav">
                                <p>P{i+1}阶段</p>
                             </div>
                             <div className="panel">
                                <div>阶段金额 <p>{e.price}$</p></div>
                                <div>阶段周期 <p>{e.date}天</p></div>
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