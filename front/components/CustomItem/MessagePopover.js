import { Empty, message } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { readMsg } from "../../http/_api/user";




export default function MessagePopover(params) {
    
    const { messageList, setMessageList } = params;
    const router = useRouter();

    const read = (id,i) => {
        readMsg({id: id})
        .then(res => {
            if (res.code === 0) {
                messageList[i].status = 1;
                setMessageList([...messageList])
                // message.success(res.msg)
            }else{
                // message.warning(res.msg)
            }
        })
    }

    useEffect(() => {
        console.log(messageList);
    },[messageList])

    return <div className="messagePopover">
        <div className="nav">
            <p className="nav-title">Message</p>
            <p onClick={() => router.push(`/messageCenter`)}>View All <span></span></p>
        </div>
        <div className="message-list">
            {
                messageList.map((e,i) => 
                    <div className="message-item" key={e.ID} onClick={() => read(e.ID,i)}>
                        <div className="content">
                            <div className={`point ${e.status === 0 ? "unread" : "read"}`}></div>
                            <div className="item-content" dangerouslySetInnerHTML={{__html: e.message}}></div>
                        </div>
                    </div>
                )
            }
            {
                messageList.length === 0 &&
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
        </div>
    </div>
}