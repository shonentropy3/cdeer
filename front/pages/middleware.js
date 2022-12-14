import { useContext, useEffect, useState } from "react"
import { AuthContext } from "react-admin";
import { useAccount } from "wagmi";
import ConnectModal from "../components/CustomModal/connectModal";

export default function withAuth (Component)  {
    const Auth = props => {
        const { user } = useContext(AuthContext);
        const { address } = useAccount();
        let [isModalVisible,setIsModalVisible] = useState(false);



        useEffect(() => {
            const token = localStorage.getItem(`session.${address?.toLowerCase()}`);
            if (!token && !address) {
                setIsModalVisible(true)
            }
        },[user])

        return <>
           {
            isModalVisible &&  <ConnectModal setStatus={setIsModalVisible} status={isModalVisible} />
           }
            {
                address && localStorage.getItem(`session.${address.toLowerCase()}`) && <Component {...props} />
            }
        </>
    }
    return Auth
}
