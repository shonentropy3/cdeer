import { Button, Modal, Dropdown, Menu, } from 'antd';
import { CloseOutlined } from "@ant-design/icons"
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDisconnect, useConnect, useAccount, useNetwork, useSwitchNetwork } from 'wagmi';    // 切换链 
import Identicon, { IdenticonOptions } from "identicon.js";
// import intl from 'react-intl-universal';
// import { emit } from "../../locales/emit";
// import { ChangeLanguage } from '../../utils/ChangeLanguage';
import { useRouter } from 'next/router';
export default function Header(props) {

    // const { setLan, language } = props;
    const lanSwitch = [
        {title: '中文', value:'en_US'},
        {title: '英文', value:'zh_CN'}
    ]
      // 网络切换
    const { chain } = useNetwork()
    const { chains, switchNetwork } = useSwitchNetwork()
    const router = useRouter()
    const {connect,chainId,connectors,error,isLoading,pendingConnector} = useConnect()
    const {isConnected, address} = useAccount()
    const {disconnect} = useDisconnect()

    // 记录需要的连接方式
    let [needConnector,setNeedConnector] = useState([])
    
    let [selectItem,setSelectItem] = useState('')
    let item = [
        {title: '首页', url: '/', value: 'home'},
        {title: '寻找项目', url: '/projects', value: 'task'},
        {title: '我的项目', url: '/MyInfo', value: 'my'}
    ]
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
                <Link href={{pathname: '/MyInfo'}}>
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

    // const languageSwitch = async(value) => {
    //     await router.push({href:'/', search: value})
    //     checkLanguage()
    // }

    // const checkLanguage = () => {
    //     let l = ChangeLanguage()
    //     setLan( l )
    //     emit.emit('change_language', l);
    // }

    const onchange = (value) => {
        selectItem = value;
        setSelectItem(selectItem);
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

    // 筛选所需要的连接方式
    const selectConnector = () => {
        connectors.map((e,i) => {
            if(e.name == "MetaMask" || e.name == "WalletConnect") {
                    needConnector.push(e)
            }
        })
        setNeedConnector([...new Set(needConnector)])
    }

    useEffect(() => {
        item.map(e => {
            if (e.url === location.pathname) {
                selectItem = e.value;
            }
        })
        setSelectItem(selectItem)
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

    useEffect(() => {
        if (switchNetwork) {
            // switchNetwork(chain.id)
            // console.log(chain);
            // TODO: 切换网络
        }
    },[switchNetwork])

    useEffect(() => {
        selectConnector()
    },[])


    return <div className="Header">
        <div className={`content ${isScroll ? 'scroll':''}`}>
            <div className="header-logo">
                <Image src="/logo1.png" alt="" layout="fill" objectFit="cover" />
            </div>
            <div className="header-nav">
                {
                    item.map((e,i) => 
                        <Link key={i} href={{pathname:e.url}}>
                            <div className={`li ${selectItem === e.value ? 'li-active':''}`} onClick={() => onchange(e.value)}>
                                {e.title}
                                <div className="line" />
                            </div>
                        </Link>
                    )
                }

            </div>
            <div className="header-info">
                {/* TODO: 中英文切换入口 ==> img or font */}
                {/* {
                    lanSwitch.map((e,i) => 
                      e.value !== language ? 
                      <div className="img" key={i} >
                          <p value={e.value} onClick={() => languageSwitch(e.value)}>{e.title}</p>
                      </div> : ''
                    )
                } */}
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
            title={<p>Link Wallet <CloseOutlined onClick={handleCancel} /></p>} 
            footer={null} 
            open={isModalVisible} 
            closable={false}
            onCancel={handleCancel}
            className="connect"
        >
            {needConnector.map((connector) => (
                <Button
                    key={connector.id}
                    onClick={() => {connect({ connector }), handlerCancel()}}
                >
                    <p className='connect-img'>
                        <img src={"/"+connector.name+".png"} />
                    </p>
                    <p className='connect-text'>{connector.name}</p>
                </Button>
            ))}
        </Modal>
    </div>
}