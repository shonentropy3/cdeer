import Link from 'next/link'
import { Dropdown, Menu, Button, Modal, Divider } from 'antd';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { clearValue } from '../../redux/web3_reactSlice'
import Card from '../../components/Card';



function Header() {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const redux = useSelector(state => state.web3_react.value)
    let [web3_react, setWeb3] = useState({})
    let [account,setAccount] = useState()
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
                <p onClick={() => {
                    web3_react.wallet.deactivate ? 
                    web3_react.wallet.deactivate()
                    : ''
                dispatch(clearValue())}}>退出登陆</p>
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