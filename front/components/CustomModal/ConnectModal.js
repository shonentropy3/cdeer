import { CloseOutlined } from "@ant-design/icons"
import { Button, Modal } from "antd"
import { useEffect, useState } from "react";
import { useConnect, useSwitchNetwork } from "wagmi";



export default function ConnectModal(params) {
    
    const { setStatus, status } = params;
    const { connect, connectors } = useConnect();
    const { switchNetwork } = useSwitchNetwork();
    let [needConnector,setNeedConnector] = useState([]);


    useEffect(() => {
        connectors.map((e,i) => {
            if(e.name == "MetaMask" || e.name == "WalletConnect") {
                    needConnector.push(e)
            }
        })
        setNeedConnector([...new Set(needConnector)]) 
    },[])

    useEffect(() => {
        if (switchNetwork) {
            switchNetwork(Number(
                process.env.NEXT_PUBLIC_DEVELOPMENT_CHAIN_ID ? 
                process.env.NEXT_PUBLIC_DEVELOPMENT_CHAIN_ID
                :
                process.env.NEXT_PUBLIC_PRODUCTION_CHAIN_ID
                ))
            // switchNetwork(chain.id)
            // console.log(chain);
            // TODO: 切换网络
        }
    },[switchNetwork])


    return <Modal
            title={<p>Link Wallet <CloseOutlined onClick={() => setStatus(false)} /></p>} 
            footer={null} 
            open={status} 
            closable={false}
            onCancel={() => setStatus(false)}
            className="connect"
        >
        {needConnector.map((connector) => (
            <Button
                key={connector.id}
                onClick={() => {connect({ connector }), setStatus(false)}}
            >
                <p className='connect-img'>
                    <img src={"/"+connector.name+".png"} />
                </p>
                <p className='connect-text'>{connector.name}</p>
            </Button>
        ))}
    </Modal>
}