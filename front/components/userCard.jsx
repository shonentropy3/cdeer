import { Button } from "antd";
import { useConnect } from "wagmi";

export function userCard (){
    const {connect,chainId,connectors,error,isLoading,pendingConnector} = useConnect()

    return (
        <div></div>
    )
}
 

