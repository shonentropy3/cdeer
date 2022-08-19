import Link from 'next/link'
import Router from "next/router"
import { Dropdown, Menu, Button, Modal, Divider } from 'antd';

import { useEffect, useState } from 'react';
import Card from '../../components/Card';

import {
    useAccount,
    useDisconnect,
  } from 'wagmi'




function Header() {
    const { address, connector, isConnected } = useAccount()
    const { disconnect } = useDisconnect()
    const [isModalVisible, setIsModalVisible] = useState(false);
    let [wagmi,setWagmi] = useState({})


    const menu = (
        <Menu
          items={[
            {
                type: 'group',
                label: (
                    <p>Hello, <em>{wagmi.account}</em></p>
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
                <p onClick={ disconnect }>
                    退出登陆
                </p>
              ),
            }
          ]}
        />
      );

    const inspection = (url) => {
        // 检测登陆状态
        if (!wagmi.isActive) {
            setIsModalVisible(true);
            return
        }
        Router.push({pathname: url, query: {}})
    }    



    const showModal = () => {
        setIsModalVisible(true);
      };

    const handleOk = () => {
      setIsModalVisible(false);
    };
    
    const handleCancel = () => {
      setIsModalVisible(false);
    };
    useEffect(() => {
        if (isConnected) {
            wagmi = {
                account: address.slice(0,5) + '...' + address.slice(38,42), 
                isActive: isConnected
            }
        }else{
            wagmi = {
                isActive: isConnected
            }
        }
        setWagmi({...wagmi})
    },[isConnected])

    return (
        <>
        <Modal title="" className='Mask_connect' visible={isModalVisible} footer={null} onCancel={handleCancel}>
          <Card cancel={handleCancel}></Card>
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
                    wagmi.isActive ? (
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
            </div>
        </div>
        </>
    )
}
export default Header