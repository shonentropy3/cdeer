import { useContext, useEffect, useState } from "react"
import { AuthContext } from "react-admin";
import { useAccount } from "wagmi";
import ConnectModal from "../components/CustomModal/connectModal";

export default function withAuth (Component)  {
    const Auth = props => {
        const { user } = useContext(AuthContext);
        let [token, setToken] = useState()
        const { address } = useAccount();
        let [isModalVisible,setIsModalVisible] = useState(false);



        useEffect(() => {
            setToken(localStorage.getItem(`session.${address?.toLowerCase()}`))
            if (!token && !address) {
                setIsModalVisible(true)
            }
        },[user])

        return <>
           {
            isModalVisible &&  <ConnectModal setStatus={setIsModalVisible} status={isModalVisible} />
           }
           {
            token ? <Component {...props} /> : <h1>请登陆</h1>
           }
            {/* <Component {...props} /> */}
        </>
    }
    return Auth
}
