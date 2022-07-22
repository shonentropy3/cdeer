import { useState } from "react"
import Order from "../controller/order"
import Attend from "./ApplyFor"
import { Button, Modal } from 'antd';

function RegistrationList(params) {

    const {data} = params
    let [maskStatus,setMaskStatus] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
      setIsModalVisible(true);
    };
  
    const handleOk = () => {
        console.log('ok');
      setIsModalVisible(false);
    };
  
    const handleCancel = () => {
        console.log('nono');
      setIsModalVisible(false);
    };
  
    const toggleMask = () => {
        maskStatus = true 
        setMaskStatus(maskStatus)
    }
    //  TODO:1、是否确认合作 ==> 2、展示取消订单和修改订单
    return(
        <>
            {
                maskStatus ? 
                <div className="Mask">
                    <Attend setParent={setMaskStatus} data={data} />
                </div>
                :
                ''
            }
            
            <div className="RegistrationList">
                <div className="left">
                    <div>
                        {/* {data.apply_addr} */}
                        xx
                    </div>
                    <div>
                        {/* 预估价:{data.price} */}
                        xx
                    </div>
                </div>
                <div className="right">
                    {/* <button>不合适</button> */}
                    <button onClick={() => toggleMask()}>确认合作</button>
                    {/* 
                        订单状态 > 0 && 订单状态 < 3
                        <button>修改订单</button>
                        <button>取消订单</button>
                    */}
                        <button onClick={() => showModal()}>修改订单</button>
                        <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                        </Modal>
                </div>
            </div>
        </>
    )
}

export default RegistrationList