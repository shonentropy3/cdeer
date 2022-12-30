import { Button, InputNumber, message, Modal, Select } from "antd";
import Image from "next/image";
import { useState } from "react";
export default function ProlongModal(params) {
    
    const { close, prolong, loading } = params;
    let [period, setPeriod] = useState()

    const changePeriod = () => {
        if (!period) {
            message.error('请输入延长时间')
            return
        }
        prolong(period)
    }

    return <Modal
        open
        footer={null} 
        onCancel={() => close(false)}
        className="modal-order-receiver prolongModal"
        closeIcon={<img src="/closeIcon.png" />}
    >
        <div className="img">
            <Image src="/img/modal-redlight.png" layout="fill" quality={100} />
        </div>
        <p className="title">Application for extension</p>
        <div className="inner">
            <p className="inner-title">Select extension time</p>
            <div className="flex">
                <InputNumber min={0} className="input" controls={false}  value={period} onChange={e => setPeriod(e)} />
                <p>Day</p>
            </div>
        </div>
        <p className="tips">The delay will not increase the development cost, please communicate with the receiving party in advance.</p>
        <div className="btns">
            <Button onClick={() => close(false)}>Cancel</Button>
            <Button onClick={() => changePeriod()} loading={loading}>Submit</Button>
        </div>
    </Modal>
}