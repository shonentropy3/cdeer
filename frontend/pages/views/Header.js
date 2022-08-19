import Link from 'next/link'
import Router from "next/router"
import { Dropdown, Menu, Button, Modal, Divider } from 'antd';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { clearValue } from '../../redux/web3_reactSlice'
import Card from '../../components/Card';
import InitConnect from '../../redux/initConnect';
import DisConnect from '../../components/disConnect';
import axios from 'axios';

import {
    useAccount,
    useConnect,
    useDisconnect,
    useEnsAvatar,
    useEnsName,
    useProvider
  } from 'wagmi'

function Header() {
    const { address, connector, isConnected } = useAccount()
    const { data: ensAvatar } = useEnsAvatar({ addressOrName: address })
    const { data: ensName } = useEnsName({ address })


    const [isModalVisible, setIsModalVisible] = useState(false);
    const redux = useSelector(state => state.web3_react.value)
    let [web3_react, setWeb3] = useState({})
    let [account,setAccount] = useState()
    let [provider,setProvider] = useState()
    const dispatch = useDispatch()
    



    const menu = (
        <Menu
          items={[
            {
                type: 'group',
                label: (
                    <p value={web3_react.accounts}>Hello, <em>{account}</em></p>
                )
            },
            {
                type: 'divider',
            },
            {
              key: '1',
              label: (
                <Link href="/views/My">
                  个人中心
                </Link>
              ),
            },
            {
                type: 'divider',
            },
            {
              key: '2',
              danger: true,
              label: (
                <DisConnect provider={ provider } />
              ),
            }
          ]}
        />
      );

    const showModal = () => {
        setIsModalVisible(true);
      };

    const handleOk = () => {
      setIsModalVisible(false);
    };
    
    const handleCancel = () => {
      setIsModalVisible(false);
    };

    const inspection = (url) => {
        // 检测登陆状态
        if (!web3_react.isActive) {
            setIsModalVisible(true);
            return
        }
        Router.push({pathname: url, query: {}})
    }    

    useEffect(() => {
        web3_react = redux;
        setWeb3({...web3_react})
        
        if (!web3_react.isActive) {
            return
        }
        account = web3_react.accounts[0]
        account = account.substr(0,5) + '...' + account.substr(account.length - 4 , 4)
        setAccount(account)
    },[redux])

    useEffect(() => {
        provider = window.localStorage.getItem("provider");
        setProvider(provider)
    },[])

    return (
        <>
        <Modal title="" className='Mask_connect' visible={isModalVisible} footer={null} onCancel={handleCancel}>
          <Card cancel={handleCancel}></Card>
        </Modal>
        <div className='header'>
            <InitConnect provider={provider}></InitConnect>
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
                        <div className="_li" onClick={() => inspection('/views/Myproject')}>
                            我的项目
                        </div>
                    <Link href="/views/Publish">
                        <div className="_li">
                            发布项目
                        </div>
                    </Link>
                </div>
                {
                    web3_react.isActive ? (
                        <>
                        <Dropdown overlay={menu}>
                        <div className="avt">
                            
                        </div>
                        </Dropdown>
                        </>
                    ) : (
                        <Button className='connect' type="primary" onClick={() => showModal()}>connect</Button>
                    )
                }
                {
                    isConnected ? 
                    <div>
                        <img src={ensAvatar} alt="ENS Avatar" />
                        <div>{ensName ? `${ensName} (${address})` : address}</div>
                        {/* <div>Connected to {connector.name}</div> */}
                        {/* <button onClick={disconnect}>Disconnect</button> */}

                    </div>
                    :
                    ''
                }

            </div>
        </div>
        </>
    )
}
export default Header