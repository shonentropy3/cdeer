import { Button, Modal, Dropdown, Menu, } from 'antd';
import { CloseOutlined } from "@ant-design/icons"
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDisconnect, useConnect, useAccount, useNetwork, useSwitchNetwork } from 'wagmi';    // 切换链 
import Identicon, { IdenticonOptions } from "identicon.js";
import ConnectModal from '../../components/CustomModal/connectModal';
export default function Header(props) {

    const {isConnected, address} = useAccount()
    const {disconnect} = useDisconnect()

    
    let [selectItem,setSelectItem] = useState('')
    let item = [
        {title: '首页', url: '/', value: 'home'},
        {title: '寻找项目', url: '/projects', value: 'task'},
        {title: '我的项目', url: '/myInfo', value: 'my'}
    ]
    const [isModalVisible, setIsModalVisible] = useState(false);
    let [wagmi,setWagmi] = useState({});
    let [account,setAccount] = useState('');
    let [isScroll,setIsScroll] = useState(false);

    const menu = (
        <Menu
          items={[
            { key: '1', label: ( <Link href={{pathname: '/myInfo'}}>我的资料</Link> ) },
            { key: '2', label: ( <Link href={`/task/?w=issuer&bar=tasks`}>发布的项目</Link>) },
            { key: '3', label: ( <Link href={`/task/?w=worker&bar=apply`}>参与的项目</Link>) },
            { key: '4', label: ( <Link href={{pathname: '/'}}>我的NFT</Link>) }
          ]}
        />
    );
    const menu1 = (
        <Menu
          items={[{
                key: '5',
                label: (
                  <Button type="default" onClick={() => signOut()}>
                      退出登陆
                  </Button>
                )
          }]}
        />
    );

    const signOut = () => {
        disconnect();
        localStorage.clear();
    }


    const onchange = (value) => {
        selectItem = value;
        setSelectItem(selectItem);
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
        isModalVisible && console.log('头部执行了 ==>');
    },[isModalVisible])

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
                            <Button className="btn" onClick={() => setIsModalVisible(true)}>链接钱包</Button>
                        </>
                }
            </div>
        </div>
        <ConnectModal setStatus={setIsModalVisible} status={isModalVisible} />
    </div>
}