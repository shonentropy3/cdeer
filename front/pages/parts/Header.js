import { Button, Modal, Dropdown, Menu } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDisconnect, useConnect, useAccount } from 'wagmi';

export default function Header() {

    const {connect,chainId,connectors,error,isLoading,pendingConnector} = useConnect()
    const {isConnected, address} = useAccount()
    const {disconnect} = useDisconnect()
    
    let [selectItem,setSelectItem] = useState([
        {title: '首页', url: '/', checked: true},
        {title: '寻找项目', url: '/projects', checked: false},
        {title: '我的项目', url: '/', checked: false}
    ])
    const [isModalVisible, setIsModalVisible] = useState(false);
    let [wagmi,setWagmi] = useState({});
    let [isScroll,setIsScroll] = useState(false);

    const menu = (
        <Menu
          items={[
            {
              key: '1',
              label: (
                <Link href={{pathname: '/myInfo'}}>
                    我的资料
                </Link>
              ),
            },
            {
              key: '2',
              label: (
                <Link href={{pathname: '/issuer/projects'}}>
                  发布的项目
                </Link>
              ),
            },
            {
              key: '3',
              label: (
                <Link href={{pathname: '/worker/Projects'}}>
                  参与的项目
                </Link>
                ),
            },
            {
              key: '4',
              label: (
                <Link href={{pathname: '/'}}>
                    我的NFT
                </Link>
              ),
            },
            {
                key: '5',
                label: (
                  <Button type="default" onClick={() => disconnect()}>
                      退出登陆
                  </Button>
                ),
              }
          ]}
        />
      );
    const showModal = () => {
      setIsModalVisible(true);

    };
  
    const handleCancel = () => {
      setIsModalVisible(false);
    };

    const onchange = (title) => {
        selectItem.map((e,i) => {
            e.checked = false;
            if (e.title === title) {
                e.checked = true;
            }
        })
        setSelectItem([...selectItem]);
    }

    const handlerCancel = ()=>{
        setIsModalVisible(false)
    }

    useEffect(() => {
        selectItem.map(e => {
            e.checked = false;
            if (e.url === location.pathname) {
                e.checked = true;
            }
        })
        setSelectItem([...selectItem])
    },[])

    useEffect(()=>{
        if(isConnected){
            wagmi = {
                account: address.slice(0,5)+"..."+address.slice(38,42),
                isActive: isConnected
            }
        }else{
            wagmi = {
                isActive: isConnected
            }
        }
        setWagmi({...wagmi})
    },[isConnected])

    useEffect(() => {
        window.addEventListener("scroll", handleScroll)
        handleScroll()
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    })
    const handleScroll = () =>{
        let scrollY = window.scrollY;
        if(scrollY >= 30){
            isScroll = true;
        }else{
            isScroll = false
        }
        setIsScroll(isScroll);
    }



    return <div className="Header">
        <div className={`content ${isScroll ? 'scroll':''}`}>
            <div className="header-logo">
                <Image src="/logo1.png" alt="" layout="fill" objectFit="cover" />
            </div>
            <div className="header-nav">
                {
                    selectItem.map((e,i) => 
                        <Link key={i} href={{pathname:e.url}}>
                            <div className={`li ${e.checked ? 'li-active':''}`} onClick={() => onchange(e.title)}>
                                {e.title}
                                <div className="line" />
                            </div>
                        </Link>
                    )
                }

            </div>
            <div className="header-info">
                <Dropdown overlay={menu} placement="bottom">
                    {/* <a onClick={(e) => e.preventDefault()}> */}
                        <div className="img"></div>
                    {/* </a> */}
                </Dropdown>
                {
                    wagmi.isActive ? 
                        <p className="btn">{wagmi.account}</p>
                        :
                        <Button className="btn" onClick={showModal}>链接钱包</Button>
                }
            </div>
        </div>
        <Modal 
            title="连接钱包" 
            footer={null} 
            open={isModalVisible} 
            closable={false}
            onCancel={handleCancel}
        >
            {connectors.map((connector) => (
                <Button
                    key={connector.id}
                    onClick={() => {connect({ connector }), handlerCancel()}}
                >
                {connector.name}
                </Button>
            ))}
        </Modal>
    </div>
}