import { Button, InputNumber, Modal, Select } from "antd";
import Image from "next/image";
import { useState } from "react";
const { Option } = Select;
export default function InviteModal(params) {
    
    const { close, invitation, loading } = params;
    let [amount, setAmount] = useState()

    const selectAfter = (
        <Select
          defaultValue="ETH"
        >
          <Option key="1" value="ETH">ETH</Option>
          <Option key="2" value="BTC">BTC</Option>
        </Select>
    );

    return <Modal
    open
        footer={null} 
        onCancel={() => close(false)}
        className="modal-order-receiver"
        closeIcon={<img src="/closeIcon.png" />}
    >
        <div className="order-receiver-icon">
            <Image src="/tipIcon.png" width={87} height={79} quality={100} />
        </div>
        <p className="order-receiver-title">Give your budget</p>
        <InputNumber className="order-receiver-price" controls={false} addonAfter={selectAfter} value={amount} onChange={e => setAmount(e)} />
        <p className="order-receiver-inviteTip">After selecting the order to be received, please communicate with the order receiver and wait for the order receiver to submit the stage division。</p>
        <Button className="btn" onClick={() => invitation(amount)} loading={loading}>Invite cooperation</Button>
    </Modal>
}