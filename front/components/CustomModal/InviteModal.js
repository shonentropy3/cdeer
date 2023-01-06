import { Button, InputNumber, Modal, Select } from "antd";
import Image from "next/image";
import { useState } from "react";
import { Sysmbol } from "../../utils/Sysmbol";
const { Option } = Select;
export default function InviteModal(params) {
    
    const { close, invitation, loading } = params;
    const dUSDT = Sysmbol().dUSDT;
    const errorERC20 = "0xd57e02dA8f94d642C75C80CE1985Bf04416CA600";


    let [amount, setAmount] = useState();
    let [token, setToken] = useState("0x0000000000000000000000000000000000000000");

    const selectAfter = (
        <Select
          defaultValue="ETH"
          onChange={e => changeToken(e)}
        >
          <Option key="1" value="0x0000000000000000000000000000000000000000">ETH</Option>
          <Option key="2" value={dUSDT}>dUSDT</Option>
          <Option key="3" value={errorERC20}>errorERC20</Option>
        </Select>
    );

    const changeToken = (e) => {
        token = e;
        setToken(token);
    }

    return <Modal
    open
        footer={null} 
        onCancel={() => close(false)}
        className="modal-order-receiver"
        closeIcon={<img src="/closeIcon.png" />}
    >
        <div className="order-receiver-icon">
            <Image src="/img/tipIcon.png" width={87} height={79} quality={100} />
        </div>
        <p className="order-receiver-title">Give your budget</p>
        <InputNumber min={0} className="order-receiver-price" controls={false} addonAfter={selectAfter} value={amount} onChange={e => setAmount(e)} />
        <p className="order-receiver-inviteTip">After selecting the order to be received, please communicate with the order receiver and wait for the order receiver to submit the stage division。</p>
        <Button className="btn" onClick={() => invitation(amount,token)} loading={loading}>Invite cooperation</Button>
    </Modal>
}