import { useEffect, useState } from "react"
import { useContracts, useContractsRead } from "../controller/index"
import Link from "next/link";
import { Button, Modal, InputNumber, message } from 'antd';
import { ethers } from "ethers";

function RegistrationList(params) {

    const {data} = params
    const [isModalVisible, setIsModalVisible] = useState(false);
    let [count,setCount] = useState(null);
    let [oid,setOid] = useState(null);
    let [stage,setStage] = useState();
    const { useOrderContractWrite } = useContracts('createOrder')
    const { useOrderContractRead: getOid } = useContractsRead('applyOrderIds',[data.task_id, data.apply_addr])
    const { useOrderContractRead: getStage } = useContractsRead('orders',oid)

    const showModal = () => {
      setIsModalVisible(true);
    };

    const onChange = (e) => {
      count = e;
      setCount(count);
    }

    const handleOk = async() => {
        let obj = {
          demandId: Number(data.task_id),
          applyAddr: data.apply_addr,
          amount: Number(count),
          token: '0x90f79bf6eb2c4f870365e785982e1f101e93b906'
        }
        useOrderContractWrite.write({
            recklesslySetUnpreparedArgs: [{
              taskId: obj.demandId,
              worker: obj.applyAddr,
              token: obj.token,
              amount: ethers.utils.parseEther(`${obj.amount}`),
              checked: 1,     // default
              startDate: 123423   //  TODO >>>>
            }]
        })
    };

    useEffect(() => {
      useOrderContractWrite.isSuccess ? 
          writeSuccess()
          :
          ''
    },[useOrderContractWrite.isSuccess])
  
    const writeSuccess = () => {
      message.success('操作成功!')
      setTimeout(() => {
          history.go(0)
      }, 500);
    }

    const handleCancel = () => {
      setIsModalVisible(false);
    };

    const print = () => {
      switch (stage) {
          case 0:
              return  <button onClick={() => showModal()}>确认合作</button>
          case 1:
              return  <button onClick={() => showModal()}>修改订单</button>
          case 2:
              return  <div>
                    <Link href={{pathname:"/views/details/Stage",query:{address: data.apply_addr,task_id: Number(data.task_id)}}}>
                        <button>阶段详情</button>
                    </Link>
              </div>
      }
    }

    useEffect(() => {
        if (getOid.data !== undefined) {
            oid = getOid.data.toString();
            setOid(oid)
            if (oid === "0") {
            stage = 0
            setStage(stage)
            }
        }
    },[])

    useEffect(() => {
        if (getStage.data !== undefined && oid !== "0") {
          if (getStage.data.checked === 0) {
              stage = 1
          }else{
              stage = 2
          }
          setStage(stage)
        }
    },[oid])

      //  TODO:1、是否确认合作 ==> 2、展示取消订单和修改订单
      return(
        <>
            <Modal title="输入价格" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                价格: <InputNumber size="large" min="1" onChange={onChange} />
            </Modal>
            <div className="RegistrationList">
                <div className="left">
                    <div>
                        {data.apply_addr}
                    </div>
                    <div>
                        预估价:{data.price}
                    </div>
                </div>
                <div className="right">
                    {print()}
                </div>
            </div>
        </>
    )
}

export default RegistrationList