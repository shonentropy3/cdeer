import Link from 'next/link'
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space, Button, Modal, Divider } from 'antd';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { clearValue } from '../../redux/web3_reactSlice'
import Card from '../../components/Card';


function Header() {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const redux = useSelector(state => state.web3_react.value)
    let [web3_react, setWeb3] = useState({})
    const dispatch = useDispatch()

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
                        <p onClick={() => {
                            web3_react.wallet.deactivate ? web3_react.wallet.deactivate() : ''
                            dispatch(clearValue())
                        }}>{web3_react.accounts[0]}</p>
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