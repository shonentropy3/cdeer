import { Tooltip } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getUserInfo } from "../../http/_api/public";
import { deform_Skills } from "../../utils/Deform";
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
                setUser({...user});
            }
        })
    },[])

    return (
        user &&
        <div className="issuer-workerInfo">
            <div className="workerInfo-title">{who === 'issuer' ? '接单者' : '发单者'}</div>
            <div className="workerInfo-content">
                <div className="img"></div>
                <div className="info">
                    <p className="title">tony<span>View personal information</span></p>
                    <p className="subtitle">Good at skills： 
                        {
                            user.role.map((e,i) => (
                                <span key={i}>{e}</span>
                            ))
                        }
                    </p>
                    <UserSocialMedia userInfo={user} />
                </div>
            </div>
        </div>
    )
}