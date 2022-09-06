import { Button, Modal, Dropdown, Menu } from 'antd';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { Connector, useConnect, useAccount } from 'wagmi';
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
            <Link href={{pathname: '/'}}>
              发布的项目
            </Link>
          ),
        },
        {
          key: '3',
          label: (
            <Link href={{pathname: '/'}}>
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
                <Dropdown overlay={menu} placement="bottom">
                    {/* <a onClick={(e) => e.preventDefault()}> */}
                        <div className="img"></div>
                    {/* </a> */}
                </Dropdown>
                {
                    wagmi.isActive ? 
                        <p className="btn">{wagmi.account}</p>
                        :
                        <Button className="btn" onClick={showModal}>连接钱包</Button>
                }
            </div>
        </div>
        <Modal 
            title="连接钱包" 
            footer={null} 
            visible={isModalVisible} 
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