import Image from "next/image";
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { msgList, readMsg } from "../http/_api/user";
import { getDate } from "../utils/GetDate";
import Identicon from "identicon.js";
import { message, Pagination } from "antd";
import { getJwt } from "../utils/GetJwt";

export default function MessageCenter(params) {
    

    const { address } = useAccount();

    let [messageList, setMessageList] = useState([]);
    let [pageConfig, setPageConfig] = useState({
        page: 1, pageSize: 10, total: 0
    })

    const read = (id,i) => {
        readMsg({id: id})
        .then(res => {
            if (res.code === 0) {
                messageList[i].status = 1;
                setMessageList([...messageList]);
                // message.success(res.msg)
            }else{
                // message.warning(res.msg)
            }
        })
    }

    const changeConfig = (e) => {
        pageConfig.page = e;
        setPageConfig({...pageConfig});
    }

    const hashAvt = (address) => {
        var hash = address;  // 15+ hex chars
        var data = new Identicon(hash, {format: 'svg'}).toString();
        data = `data:image/svg+xml;base64,${data}`
        return data
    }

    const init = () => {
        const token = localStorage.getItem(`session.${address?.toLowerCase()}`);
        if (!token) {
            return
        }else{
            // 判断token有效期
            const status = getJwt(token);
            if (!status) {
                return
            }
        }
        msgList(pageConfig)
       .then(res => {
            if (res.code === 0) {
                messageList = res.data?.list || [];
                messageList.map(e => {
                    e.created_at = getDate(e.created_at, 'd')
                })
                setMessageList([...messageList]);
            }
       }) 
    }

    useEffect(() => {
        init()
    },[pageConfig])

    return  <div className="messageCenter">
        <div className="banner">
            <p className="banner-title">消息通知</p>
        </div>
        <div className="content">
            <div className="container">
                <p className="content-title">全部</p>
                <div className="message-list">
                    {
                        messageList.map((e,i) => 
                            <div key={e.ID} className="message-item" onClick={() => {read(e.ID,i)}}>
                                <div className="item-icon">
                                    {
                                        // 是否是自己的消息
                                        e.send_id === 0 ? 
                                            <Image src="/icon/message.png" layout="fill" />
                                        :
                                            e.avatar ? 
                                                <img src={process.env.NEXT_PUBLIC_DEVELOPMENT_API + "/" + e.avatar} alt="" />
                                            :
                                                <img src={hashAvt(e?.send_addr)} alt="" />
                                    }
                                    {e.status === 0 && <div className="unread" />}
                                </div>
                                <div className={`item-content ${e.status === 0 ? "block" : "none"}`} dangerouslySetInnerHTML={{__html: e.message}} />
                                <div className="item-date">
                                    {e.created_at}
                                </div>
                            </div>    
                        )
                    }
                </div>
                <Pagination onChange={(e) => changeConfig(e)} className="pagination" defaultCurrent={1} total={pageConfig.total} />
            </div>
        </div>
    </div>
}