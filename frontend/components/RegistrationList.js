import { useState } from "react"
import { Order } from "../controller/order";

import { Button, Modal, InputNumber, message } from 'antd';

function RegistrationList(params) {

    const {data} = params

    const [isModalVisible, setIsModalVisible] = useState(false);
    let [count,setCount] = useState(null);

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
      obj = JSON.stringify(obj)
      await Order({proLabel:obj})
      .then(res => {
          setIsModalVisible(false);
          message.success('操作成功!')
      })
      .catch(err => {
          console.log(err);
      })
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
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
                    {/* <button>不合适</button> */}
                    <button onClick={() => showModal()}>确认合作</button>
                    {/* 
                        订单状态 > 0 && 订单状态 < 3
                        <button>修改订单</button>
                    */}
                        <button onClick={() => showModal()}>修改订单</button>
                </div>
            </div>
        </>
    )
}

export default RegistrationList