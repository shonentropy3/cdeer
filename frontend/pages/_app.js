import '../styles/globals.css'
import Header from './views/Header'
import 'antd/dist/antd.css'
// import '~antd/dist/antd.css';
import '../styles/header.scss'
import '../styles/market.scss';
import '../styles/publish.scss'
import '../styles/myproject.scss'
import '../styles/my.scss'
import '../styles/components.scss'
import '../styles/details/requirement.scss'
import '../styles/details/order.scss'
import '../styles/details/project.scss'
import '../styles/details/stage.scss'
import '../styles/globals.css'

import { useWeb3React, Web3ReactProvider } from '@web3-react/core'
import { coinbaseWallet, hooks as coinbaseWalletHooks } from '../connectors/coinbaseWallet'
import { hooks as metaMaskHooks, metaMask } from '../connectors/metaMask'
import { hooks as networkHooks, network } from '../connectors/network'
import { hooks as walletConnectHooks, walletConnect } from '../connectors/walletConnect'
import { getName } from '../utils'


const connectors = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [network, networkHooks]
]

function Child() {
  const { connector } = useWeb3React()
  // console.log(`Priority Connector is: ${getName(connector)}`)
  return null
}

function MyApp({ Component, pageProps }) {
  return(
    <>
    <Web3ReactProvider connectors={connectors}>
      <Header></Header>
      <Component {...pageProps} />
      {/* <Child /> */}
    </Web3ReactProvider>
      
    </>
  )
}

export default MyApp
