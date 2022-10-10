import { Button, Modal, Dropdown, Menu } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDisconnect, useConnect, useAccount } from 'wagmi';
import Identicon, { IdenticonOptions } from "identicon.js";
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
    let [account,setAccount] = useState('');
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
                <Link href={{pathname: '/task', search: 'issuer'}}>
                  发布的项目
                </Link>
              ),
            },
            {
              key: '3',
              label: (
                <Link href={{pathname: '/task', search: 'worker'}}>
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
            }
          ]}
        />
    );
    const menu1 = (
        <Menu
          items={[{
                key: '5',
                label: (
                  <Button type="default" onClick={() => disconnect()}>
                      退出登陆
                  </Button>
                )
          }]}
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

    const hashAvt = () => {
        if (!address) {
            return
        }
        var hash = address;  // 15+ hex chars
        // var options = {
        //     foreground: [r, g, b, 255],               // rgba black
        //     background: [255, 255, 255, 255],         // rgba white
        //     margin: 0.2,                              // 20% margin
        //     size: 420,                                // 420px square
        //     format: 'svg'                             // use SVG instead of PNG
        //     };
        // create a base64 encoded SVG
        // var data = new Identicon(hash, options).toString();
        var data = new Identicon(hash, {format: 'svg'}).toString();
        data = `data:image/svg+xml;base64,${data}`
        return data
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
        if (address) {
            account = address.slice(0,5)+"..."+address.slice(38,42);
            setAccount(account);
        }
    },[address])

    useEffect(() => {
        window.addEventListener("scroll", handleScroll)
        handleScroll()
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    })
    const handleScroll = () =>{
        let scrollY = window.scrollY;
        if(scrollY > 0){
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
                
                {
                    wagmi.isActive ? 
                        <>
                            <Dropdown overlay={menu} placement="bottom">
                                <div>
                                    <img className="img" src={hashAvt()} alt="" />
                                </div>
                            </Dropdown>
                            <Dropdown overlay={menu1} placement="bottom" trigger={['click']}>
                                <p className="btn" style={{cursor: "pointer"}}>{account}</p>
                            </Dropdown>
                        </>
                        :
                        <>
                            <div/>
                            <Button className="btn" onClick={showModal}>链接钱包</Button>
                        </>
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