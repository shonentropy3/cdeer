import Link from 'next/link'
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space, Button, Modal, Divider } from 'antd';

import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from 'react';
import { connectors } from '../../utils/connectors';

export const injected = new InjectedConnector();


function Header() {
    const { 
        active, 
        account, 
        library, 
        connector, 
        activate, 
        deactivate, 
        chainId,
        library:provider } = useWeb3React();

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
      };

    const handleOk = () => {
      setIsModalVisible(false);
    };
    
    const handleCancel = () => {
      setIsModalVisible(false);
    };

    // 退出
    const disconnect = async() => {
        deactivate()
    }

    return (
        <>
        <Modal title="" className='Mask_connect' visible={isModalVisible} footer={null} onCancel={handleCancel}>
            <div className="title">Welcome to Code-Market</div>
            <div className='strong'>Sign-in to get started</div>
            <Button className="li" onClick={() => {
                activate(connectors.injected);
                handleCancel();
            }}>Metamask</Button>

            <Button className="li" onClick={() => {
                activate(connectors.walletConnect);
                handleCancel();
            }}>WalletConnect</Button>

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
                {/* <Link href="/views/My">
                    <div className="avt">

                    </div>
                </Link> */}
                
                {/* {active ? <p>{account}</p> : ""} */}
                {
                    active ? (
                        <p>{account}</p>
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