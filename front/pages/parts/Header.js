import { Button, Dropdown, Menu, message, Popover, } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDisconnect, useAccount } from 'wagmi';    // 切换链 
import Identicon from "identicon.js";
import ConnectModal from '../../components/CustomModal/ConnectModal';
import MessagePopover from '../../components/CustomItem/MessagePopover';
import { unReadMsgList } from '../../http/_api/user';
import store from '../../redux/store';
import { HashAvatar } from '../../utils/HashAvatar';
export default function Header(props) {

    const {isConnected, address} = useAccount()
    const {disconnect} = useDisconnect()
    const router = useRouter();

    
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
    let [messageList,setMessageList] = useState([]);
    let [isUnread, setIsUnread] = useState();

    const menu = (
        <Menu
          items={[
            { key: '1', label: ( <Link href={{pathname: '/myInfo'}}>我的资料</Link> ) },
            { key: '2', label: ( <Link href={`/user/projects?w=issuer&bar=tasks`}>发布的项目</Link>) },
            { key: '3', label: ( <Link href={`/user/projects?w=worker&bar=apply`}>参与的项目</Link>) },
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

    const content = (
        <MessagePopover messageList={messageList} setMessageList={setMessageList} />
    );

    store.subscribe(() => {
        setIsUnread(store.getState())
    })

    const getUnReadMsgList = () => {
        unReadMsgList()
        .then(res => {
            if (res.code === 0) {
                messageList = res.data.list;
                setMessageList([...messageList]);
            }else{
                message.warning(res.mesg);
            }
        })
    }

    const signOut = () => {
        disconnect();
        // localStorage.clear();
    }


    const onchange = (value) => {
        selectItem = value;
        setSelectItem(selectItem);
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

    useEffect(() => {
        if (router.pathname === "/") {
            setSelectItem('home')
        }else if (router.pathname === "/projects") {
            setSelectItem('task')
        }else{
            setSelectItem('')
        }
    },[router])

    return <div className="Header">
        <div className={`content ${isScroll ? 'scroll':''}`}>
            <div className="content-left">
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
                            <Popover content={content} trigger="click">
                                {/*  onClick={() => router.push(`/messageCenter`)} */}
                                <div className="message" onClick={() => getUnReadMsgList()}>
                                    <Image src="/img/header_notice.png" alt="" layout="fill" objectFit="cover"  />
                                    <div className={isUnread === 'unread' ? 'unread' : ''} />
                                </div>
                            </Popover>
                            
                            <Dropdown overlay={menu} placement="bottom">
                                <div>
                                    {
                                        address && 
                                        <img className="img" src={HashAvatar(address)} alt="" />
                                    }
                                </div>
                            </Dropdown>
                            <Dropdown overlay={menu1} placement="bottom" trigger={['click']}>
                                <div className="btn" style={{cursor: "pointer"}}>{account}</div>
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