import { Tooltip } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react"

export default function UserSocialMedia(params) {

    const { userInfo } = params;
    
    let [list, setList] = useState([
        {title: 'telegram', icon: '/icon/telegram.png', value: ''},
        {title: 'wechat', icon: '/icon/wechat.png', value: ''},
        {title: 'skype', icon: '/icon/skype.png', value: ''},
        {title: 'discord', icon: '/icon/discord.png', value: ''},
        {title: 'phone', icon: '/icon/whatsapp.png', value: ''},
    ])

    useEffect(() => {
        list.map(e => {
            if (userInfo[e.title]) {
                e.value = userInfo[e.title]
            }
        })
        setList([...list]);
    },[])

    return ( userInfo &&
        <div className="boxs">
            {
                list.map((e,i) => {
                    if (e.value) {
                        return (
                            <div className="box" key={i}>
                                <div className="icon">
                                    <Tooltip title={e.value}>
                                        <Image src={e.icon} layout='fill' />
                                    </Tooltip>
                                </div>
                            </div>
                        )
                    }
                })
            }
        </div>
    )

}