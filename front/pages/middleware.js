import { useContext, useEffect, useState } from "react"
import { AuthContext } from "react-admin"
import { useAccount, useSigner } from "wagmi";
import { authLoginSign, getLoginMessage } from "../http/_api/sign";
import { getJwt } from "../utils/GetJwt";

export default function withAuth (Component)  {
    const Auth = props => {
        const { user } = useContext(AuthContext);
        const { address } = useAccount();
        const { data: signer } = useSigner();
        let [message,setMessage] = useState();

        const getToken = async() => {
                // 1、获取nonce
                await getLoginMessage({address: address})
                .then(res => {
                    if (res.code === 0) {
                        message = res.data.loginMessage;
                        setMessage(message);
                    }
                })

                // 2、获取签名
                await signer.signMessage(message)
                .then(res => {

                    // 3、获取token
                    authLoginSign({
                        address: address,
                        message: message,
                        signature: res
                    })
                    .then(res => {
                        if (res.code === 0) {
                            localStorage.setItem(`session.${address.toLowerCase()}`,res.data.token)
                        }
                    })
                })
                .catch(err => {
                    console.log(err);
                })
        }

        const init = async() => {
            const token = localStorage.getItem(`session.${address.toLowerCase()}`);

            if (!token) {
                await getToken()
            }else{
                // 判断token有效期
                let userinfo = getJwt(token);
                const now = parseInt(new Date().getTime() / 1000) + (2 * 60 * 60) ;
                if (now > userinfo.exp) {
                    await getToken();
                }
            }
        }

        useEffect(() => {
            signer && signer.signMessage && init();
            // 本地是否存储token ? 
            // 是否是新用户
            // 签名
        },[signer])

        return <Component {...props} />
    }
    return Auth
}
