import { CloseOutlined } from "@ant-design/icons"
import { useRequest } from "ahooks";
import { Button, Modal } from "antd"
import { useEffect, useState } from "react";
import { useAccount, useConnect, useNetwork, useSigner, useSwitchNetwork } from "wagmi";
import Web3 from 'web3'
import { authLoginSign, getLoginMessage } from "../../http/_api/sign";
import { getJwt } from "../../utils/GetJwt";
import { GetSignature } from "../../utils/GetSignature";


export default function ConnectModal(params) {
    
    const { setStatus, status, propsInit } = params;
    const { connect, connectors } = useConnect();
    const { address, isConnecting } = useAccount();
    
    // 签名
    const { data: signer } = useSigner();
    const [message, setMessage] = useState();
    // 链
    const { chain } = useNetwork();
    const chainID = process.env.NEXT_PUBLIC_DEVELOPMENT_CHAIN_ID || process.env.NEXT_PUBLIC_PRODUCTION_CHAIN_ID
    const {switchNetwork} = useSwitchNetwork({
        onSuccess() {
            setStatus(false)
        },
        onError(error) {
          window.ethereum &&
          window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                  {
                      chainId: Web3.utils.numberToHex(8151),
                      chainName: 'BuildBear Charming Bohr 99d0de',
                      nativeCurrency: {
                      name: 'BuildBear',
                      symbol: 'BB ETH', // 2-6 characters long
                      decimals: 18
                      },
                      rpcUrls: ['https://rpc.buildbear.io/Old_Mas_Amedda_06697a31'],
                      blockExplorerUrls: ['https://explorer.buildbear.io/node/Old_Mas_Amedda_06697a31']
                  }
              ]
            }).then(() => {
                network()
            })
        }
      });
    let [needConnector,setNeedConnector] = useState([]);

    const network = () => {
        if (chain.id != chainID) {
            switchNetwork(Number(chainID))
        }else{
            setStatus(false)
        }
    }

    const getToken = async() => {
        GetSignature({address: address, signer: signer})
    }

    const init = () => {
        const token = localStorage.getItem(`session.${address.toLowerCase()}`);
        if (!token) {
            getToken()
        }else{
            // 判断token有效期
            let status = getJwt(token);
            if (!status) {
                getToken();
            }
        }
    }
    async function isRun() {
        if (signer && signer.signMessage) {
            init()
        }
    }

    const { data, runAsync } = useRequest(isRun, {
        debounceWait: 1000,
        manual: true
    });

    useEffect(() => {
        runAsync()

        // 本地是否存储token ? 
        // 是否是新用户
        // 签名
    },[signer])

    useEffect(() => {
        connectors.map((e,i) => {
            if(e.name == "MetaMask" || e.name == "WalletConnect") {
                    needConnector.push(e)
            }
        })
        setNeedConnector([...new Set(needConnector)]) 
    },[])

    useEffect(() => {
        chain && network()
    },[chain])

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