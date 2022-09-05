import { Button, Modal } from 'antd';
import Link from 'next/link'
import { useEffect, useState } from 'react';

import { Connector, useConnect, useAccount } from 'wagmi';

export default function Header() {

    const {connect,chainId,connectors,error,isLoading,pendingConnector} = useConnect()
    const {isConnected, address} = useAccount()
    
    let [selectItem,setSelectItem] = useState([
        {title: '首页', url: '/', checked: true},
        {title: '寻找项目', url: '/projects', checked: false}
    ])
    const [isModalVisible, setIsModalVisible] = useState(false);
    let [wagmi,setWagmi] = useState({})


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



    return <div className="Header">
        <div className="content">
            <div className="header-logo">
                <div className="img"></div>
                <p>LOGO</p>
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
                <div className="img"></div>
                <Button className="btn" onClick={showModal}>{wagmi.isActive?wagmi.account:"连接钱包"}</Button>
            </div>
        </div>
        <Modal 
            title="连接钱包" 
            footer={null} 
            visible={isModalVisible} 
            closable={false}
            onCancel={handleCancel}
        >
            
            {/* <Button>MetaMask</Button> */}
            {/* {
                connectors.map((connector)=>{
                    <Button key={connector.id} onClick={()=>connect({connector})}>
                        {connector.name}
                    </Button>
                })
            } */}
            {connectors.map((connector) => (
                <button
                key={connector.id}
                onClick={() => connect({ connector })}
                >
                {connector.name}
                </button>
            ))}
            {/* <Button>WalletConnect</Button> */}
            {/* <Button>MetaMask</Button> */}
        </Modal>
    </div>
}