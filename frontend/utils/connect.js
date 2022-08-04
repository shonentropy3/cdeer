import { useEffect } from "react"
import { URI_AVAILABLE } from '@web3-react/walletconnect'
import { walletConnect } from "../connectors/walletConnect";
import { metaMask } from '../connectors/metaMask';


export const ConnectMetaMask = () => {
    useEffect(() => {
        void metaMask.connectEagerly().catch(() => {
          console.debug('Failed to connect eagerly to metamask')
        })
      }, [])
}


export const ConnectWalletConnect = () => {
        walletConnect.events.on(URI_AVAILABLE, (uri) => {
          console.log(`uri: ${uri}`)
        })
        walletConnect.connectEagerly().catch(() => {
          console.debug('Failed to connect eagerly to walletconnect')
        })
}