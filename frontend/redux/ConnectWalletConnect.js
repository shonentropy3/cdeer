
import { useEffect } from 'react';
import { walletConnect, hooks } from '../connectors/walletConnect';
import { Button, message } from 'antd';
import { useDispatch } from 'react-redux'
import { changeValue } from './web3_reactSlice'
import { URI_AVAILABLE } from '@web3-react/walletconnect'

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks

export default function ConnectWalletConnect(props) {

    const { cancel } = props;
    const web3_react = {
        chainId : useChainId(),
        accounts : useAccounts(),
        isActivating : useIsActivating(),
        isActive : useIsActive(),
        provider : useProvider(),
        ENSNames : useENSNames(),
        wallet: walletConnect
    }
    // redux
    const dispatch = useDispatch()
    

    // useEffect(() => {
    //     walletConnect.events.on(URI_AVAILABLE, (uri) => {
    //       console.log(`uri: ${uri}`)
    //     })
    //   }, [])
    
    //   // attempt to connect eagerly on mount
    //   useEffect(() => {
    //     walletConnect.connectEagerly().catch(() => {
    //       console.debug('Failed to connect eagerly to walletconnect')
    //     })
    //   }, [])

    const connect = async() => {
        await walletConnect.activate()
        .then(() => {
            dispatch(changeValue(web3_react))
            window.localStorage.setItem("provider", "walletConnect");
            cancel()
            message.success('登陆成功')
            setTimeout(() => {
                history.go(0)
            }, 500);
        })
        .catch(err => {
            console.log(err);
            return
        })
        
    }

    return <Button className="li" onClick={() => connect()} >WalletConnect</Button>
}