import Link from 'next/link'
// import style from '../../styles/header.module.scss'
// import { MessageOutlined } from '@ant-design/icons';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space, Button } from 'antd';

import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from 'react';
export const injected = new InjectedConnector();


function Header() {
    const { 
        active, 
        account, 
        library, 
        connector, 
        activate, 
        deactivate, 
        library:provider } = useWeb3React();

    const [hasMetamask, setHasMetamask] = useState(false);
    useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
          setHasMetamask(true);
          connect();
        }
      },[]);
    
    const connect = async() => {
        await activate(injected)
    }

    const disconnect = async() => {
        deactivate()
    }

    return (
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
                
                {active ? <p>{account}</p> : ""}
                {hasMetamask ? (
                    active ? (
                        <Button className='connect' type="primary" onClick={() => disconnect()}>disconnect</Button>
                    ) : (
                        <Button className='connect' type="primary" onClick={() => connect()}>connect</Button>
                    )
                ) : (
                    "Please install metamask"
                )}
            </div>
        </div>
    )
}
export default Header