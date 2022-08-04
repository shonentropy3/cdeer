import Link from 'next/link'
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space, Button, Modal, Divider } from 'antd';

import { InjectedConnector } from "@web3-react/injected-connector";
import { useEffect, useState } from 'react';
import { connectors } from '../../utils/connectors';

// import { hooks, metaMask } from '../../connectors/metaMask';
// // import { hooks } from '../../connectors/walletConnect';

// const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks

import hello from '../../../deployments/abi/Hello.json'
import helloAddr from '../../contracts/deployments/Hello.json'
import { ethers } from 'ethers'
import { URI_AVAILABLE } from '@web3-react/walletconnect'
import ConnectMetaMask from '../../components/ConnectMetaMask';

export const injected = new InjectedConnector();


function Header() {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [web3_react,setWeb3_react] = useState({})

    const showModal = () => {
        setIsModalVisible(true);
      };

    const handleOk = () => {
      setIsModalVisible(false);
    };
    
    const handleCancel = () => {
      setIsModalVisible(false);
    };

    const test = async() => {

        console.log(web3_react);
        return
        // walletConnect.activate();
        // return

        const Contract = new ethers.Contract(helloAddr.address, hello.abi, provider.getSigner(accounts[0]));
        Contract.setVaule(1)
        .then(res => {
            console.log(res,'res==>');
        })
        .catch(err => {
            console.log(err);
        })
    }

    return (
        <>
        <Modal title="" className='Mask_connect' visible={isModalVisible} footer={null} onCancel={handleCancel}>
            <div className="title">Welcome to Code-Market</div>
            <div className='strong'>Sign-in to get started</div>
            
            <ConnectMetaMask className="li" change={setWeb3_react} cancel={handleCancel}></ConnectMetaMask>

            <Button className="li" onClick={() => test()}>WalletConnect</Button>

            <Button className="li" onClick={() => {
                activate(connectors.coinbaseWallet);
                handleCancel();
            }}>coinbaseWallet</Button>
            {/* <Divider>{}</Divider> */}
        </Modal>
        <div className='header'>
            <div className="left">
                <div className="logo">

                </div>
                <div className="nav">
                    <Link href="/">
                    <div className="_li">
                        找项目
                    </div>
                    </Link>
                    <div className="_li">
                        原型广场
                    </div>
                    <div className="_li">
                        帮助中心
                    </div>
                </div>
            </div>
            <div className="right">
                <div className="zone">
                    <Link href="/views/Myproject">
                        <div className="_li">
                            我的项目
                        </div>
                    </Link>
                    <Link href="/views/Publish">
                        <div className="_li">
                            发布项目
                        </div>
                    </Link>
                </div>
                {
                    web3_react.isActive ? (
                        <p>{web3_react.accounts[0]}</p>
                    ) : (
                        <Button className='connect' type="primary" onClick={() => showModal()}>connect</Button>
                    )
                }

            </div>
        </div>
        </>
    )
}
export default Header