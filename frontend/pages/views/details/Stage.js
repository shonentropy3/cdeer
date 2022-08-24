import { useEffect, useState } from "react";
import getOrderStatus from "../../../utils/getOrderStatus";
import { withRouter } from 'next/router'
import { orderStage, confirmOrder, confirmOrderStage, terminateStage, getSecondStatus } from "../../../controller/order";
import { Button, message } from "antd";
import { useSelector } from 'react-redux'
import { getDate } from "../../../utils/getDate";
import { useContractsRead, useContracts } from "../../../controller";
import { ethers } from "ethers";

function OrderDetail({router}) {

    let [address,setAddress] = useState('');
    let [task_id,setTask_id] = useState();
    let [oid,setOid] = useState('');
    let [arr,setArr] = useState([]);
    let [amount,setAmount] = useState(0);
    let [status,setStatus] = useState(false);

    const { useOrderContractRead: getOid } = useContractsRead('applyOrderIds',[task_id, address])
    const { useOrderContractRead: getStages } = useContractsRead('getOrderStages',oid)
    const { useOrderContractWrite: contract } = useContracts('confirmOrder')
    // 
    
    useEffect(() => {
        if (getOid.data !== undefined) {
            oid = getOid.data.toString();
            setOid(oid)
        }
    },[address])

    useEffect(() => {
        if (getStages.data !== undefined) {
            let data = getStages.data;
            data.forEach((e, i) => {
                let price = Number(e[0].toString()) / 1000000000000000000;
                amount += price;

                arr[i] = {
                    price: price,
                    date: getDate(e[4].toString() * 1000),    // 参数需要毫秒数，所以这里将秒数乘于 1000
                    dsc: e[1]
                }
            })
            setAmount(amount)
            setArr([...arr])
        }
    },[oid])

    useEffect(() => {
        contract.isSuccess ? 
            writeSuccess()
            :
            ''
    },[contract.isSuccess])

    const writeSuccess = () => {
        message.success('确认订单成功')
            setTimeout(() => {
                history.go(0)
            }, 1000);
    }

    const confirmOrd = async() => {
        contract.write({
            recklesslySetUnpreparedArgs: [
                oid,
                {
                    value: ethers.utils.parseEther(`${amount}`),
                }
            ]
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
            if (res.code == 200) {
                message.success('终止交付成功!');
                setTimeout(() => {
                    history.go(0)
                }, 1000);
            }else{
                message.error('终止交付失败!');
            }
        })
    }

    useEffect(() => {
        task_id = Number(router.asPath.split('=')[2]);
        address = router.asPath.split('=')[1].split('&')[0];
        setAddress(address);
        setTask_id(task_id);
    },[])

    return <div className="OrderDetail">
        <div className="StageContainer">
            <div className="title">
                {
                    !status ? 
                    <Button type="primary" onClick={() => confirmOrd()}> 确认订单 </Button>
                    :
                    ''
                }
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
                                    {
                                        status ? 
                                            <>
                                                <Button type="primary" onClick={() => confirmStage(i)}>确认交付</Button>
                                                <Button onClick={() => rejectStage(i)} >拒绝交付</Button>
                                            </>
                                        :
                                        ''
                                    }
                                </div>
                             </div>
                        </div> )
                }
            </div>
        </div>
       
    </div>
}

export default withRouter(OrderDetail)