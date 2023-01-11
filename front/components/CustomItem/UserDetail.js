import { useEffect, useState } from "react";
import { getUserInfo } from "../../http/_api/public";
import { deform_Skills } from "../../utils/Deform";
import { HashAvatar } from "../../utils/HashAvatar";
import UserSocialMedia from "./UserSocialMedia";



export default function UserDetail(params) {
    
    const { address, who } = params;
    let [user, setUser] = useState();


    useEffect(() => {
        getUserInfo({address: address})
        .then(res => {
            if (res.code === 0) {
                user = res.data;
                user.role = deform_Skills(user.role);
                // 处理username
                user.username = user?.username || (user.address.slice(0,5) + "..." + user.address.slice(user.address.length-4,user.address.length))
                setUser({...user});
            }
        })
    },[])
    return (
        user &&
        <div className="issuer-workerInfo">
            <div className="workerInfo-title">{who === 'issuer' ? '接单者' : '发单者'}</div>
            <div className="workerInfo-content">
                <div className="img">
                    {
                        process &&
                        <img 
                            src={ user.avatar ? 
                            process.env.NEXT_PUBLIC_DEVELOPMENT_API + "/" + user.avatar 
                            :
                            HashAvatar(user.address)} 
                        />
                    }
                </div>
                <div className="info">
                    <p className="title">{user.username}<span>View personal information</span></p>
                    <p className="subtitle">Good at skills： 
                        {
                            user.role.map((e,i) => (
                                <span key={i}>{e}</span>
                            ))
                        }
                    </p>
                    {/* 社交媒体 */}
                    <UserSocialMedia userInfo={user} />
                </div>
            </div>
        </div>
    )
}