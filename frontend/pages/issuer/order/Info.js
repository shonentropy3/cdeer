import { useEffect, useState } from "react";
import getOrderStatus from "../../../utils/getOrderStatus";
import { withRouter } from 'next/router'
import { orderStage, confirmOrder, confirmOrderStage, terminateStage, getSecondStatus } from "../../../controller/order";
import { Button, message, Modal } from "antd";
import { useSelector } from 'react-redux'
import { getDate } from "../../../utils/getDate";
import { useContractsRead, useContracts } from "../../../controller";
import { ethers } from "ethers";
import Stage from "../../../components/Stage"
function OrderDetail({router}) {

    let [address,setAddress] = useState('');
    let [task_id,setTask_id] = useState();
    let [oid,setOid] = useState('');
    let [arr,setArr] = useState([]);
    let [amount,setAmount] = useState(0);
    let [status,setStatus] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { useOrderContractRead: getOid } = useContractsRead('applyOrderIds',[task_id, address])
    const { useOrderContractRead: getStages } = useContractsRead('getOrderStages',oid)
    const { useOrderContractRead: getStatus } = useContractsRead('orders',oid)
    const { useOrderContractWrite: contract, orderConfig } = useContracts('confirmOrder')
    const { useOrderContractWrite: stageComfirm } = useContracts('confirmOrderStage')
    const { useOrderContractWrite: stageReject } = useContracts('terminateStage')
    
    useEffect(() => {
        if (getOid.data !== undefined) {
            oid = getOid.data.toString();
            setOid(oid)
        }
        console.log(orderConfig);
    },[address])

    useEffect(() => {
        if (getStages.data !== undefined) {
            let data = getStages.data;
            console.log("data==>",data);
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
        if (getStages.data !== undefined) {
            if (getStatus.data.checked === 1) {
                status = false
            }
            if (getStatus.data.checked === 2) {
                status = true
            }
            setStatus(status)
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
        stageComfirm.write({
            recklesslySetUnpreparedArgs: [ oid, i ]
        })
    }

    useEffect(() => {
        stageComfirm.isSuccess ? 
            message.success('阶段交付成功!')
            :
            ''
    },[stageComfirm.isSuccess])

    const rejectStage = async(i) => {
        stageReject.write({
            recklesslySetUnpreparedArgs:[ oid, i ]
        })
    }

    useEffect(() => {
        stageReject.isSuccess ?
            message.success('终止交付成功!')
            :
            ''
    },[stageReject.isSuccess])

    useEffect(() => {
        task_id = Number(router.asPath.split('=')[2]);
        address = router.asPath.split('=')[1].split('&')[0];
        setAddress(address);
        setTask_id(task_id);
    },[])

    const showModal = () => {
        setIsModalVisible(true);
    };
    
    const handleCancel = () => {
      setIsModalVisible(false);
    };



    return <div className="OrderDetail">
        <Modal footer={null} className="Modal" visible={isModalVisible} onCancel={handleCancel}>
            <Stage modifyStages={ arr }></Stage>
        </Modal>
        <div className="StageContainer">
            <div className="title">
                {
                    !status ? 
                    <>
                        <Button type="primary" onClick={() => confirmOrd()}> 确认订单 </Button>
                        <Button type="dashed" onClick={showModal}> 修改阶段 </Button>
                    </>
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
                                                <Button type="primary" disabled={stageComfirm.isLoading} onClick={() => confirmStage(i)}>确认交付</Button>
                                                <Button disabled={stageReject.isLoading} onClick={() => rejectStage(i)} >拒绝交付</Button>
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