import { useEffect, useState } from "react";
import getOrderStatus from "../../../utils/getOrderStatus";
import { withRouter } from 'next/router'
import { orderStage } from "../../../controller/order";


function OrderDetail({router}) {

    let [address,setAddress] = useState('');
    let [task_id,setTask_id] = useState();
    let [oid,setOid] = useState('');
    
    
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

    </div>
}

export default withRouter(OrderDetail)