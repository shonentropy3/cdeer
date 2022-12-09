import { CloseOutlined } from "@ant-design/icons"
import { Button, message, Modal } from "antd"
import { useEffect, useState } from "react";
import { useAccount, useConnect, useNetwork, useSwitchNetwork } from "wagmi";
import Web3 from 'web3'


export default function ConnectModal(params) {
    
    const { setStatus, status } = params;
    const { connect, connectors } = useConnect();
    const { chain } = useNetwork();
    const { address } = useAccount();
    const {switchNetwork} = useSwitchNetwork({
        onError(error) {
          console.log('Error', error)
          window.ethereum &&
          window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                  {
                      chainId: Web3.utils.numberToHex(8478),
                      chainName: 'BuildBear Charming Bohr 99d0de',
                      nativeCurrency: {
                      name: 'BuildBear',
                      symbol: 'BB ETH', // 2-6 characters long
                      decimals: 18
                      },
                      rpcUrls: ['https://backend.buildbear.io/node/charming-bohr-99d0de'],
                      blockExplorerUrls: ['https://explorer.buildbear.io/node/charming-bohr-99d0de']
                  }
              ]
            }).then(() => {
                network()
                setStatus(false)
            })
        },
      });
    let [needConnector,setNeedConnector] = useState([]);

    const network = () => {
        switchNetwork &&
        switchNetwork(Number(
            process.env.NEXT_PUBLIC_DEVELOPMENT_CHAIN_ID ? 
                process.env.NEXT_PUBLIC_DEVELOPMENT_CHAIN_ID
                :
                process.env.NEXT_PUBLIC_PRODUCTION_CHAIN_ID
        ))
    }

    useEffect(() => {
        connectors.map((e,i) => {
            if(e.name == "MetaMask" || e.name == "WalletConnect") {
                    needConnector.push(e)
            }
        })
        setNeedConnector([...new Set(needConnector)]) 
    },[])

    useEffect(() => {
        if (chain) { network() }
    },[chain])

    useEffect(() => {
        setStatus(false)
    },[address])

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
                onClick={() => connect({ connector })}
            >
                <p className='connect-img'>
                    <img src={"/"+connector.name+".png"} />
                </p>
                <p className='connect-text'>{connector.name}</p>
            </Button>
        ))}
    </Modal>
}