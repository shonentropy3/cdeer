import '../styles/globals.css'
import '../styles/Index.scss'
import '../styles/Projects.scss'
import '../styles/Publish.scss'
import '../styles/Parts.scss'
import '../styles/Antd.scss'
import Header from './parts/Header'

import {
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains,
} from 'wagmi'

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'


const {chains, provider, webSocketProvider} = configureChains(defaultChains,[
  infuraProvider({apiKey: 'c1e833d1b315409eb99229632bafb98d'}),
  jsonRpcProvider({
    rpc: (chains)=>(
      {http: chains.rpcUrls.default}
    )
  })
])

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({chains}),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName:"wagmi"
      }
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true
      }
    }),
    new InjectedConnector({
      chains,
      options:{
        name: 'injected',
        shimDisconnect:true
      }
    })
  ],
  provider,

})


function MyApp({ Component, pageProps }) {
  return <WagmiConfig client={client} >
    <Header></Header>
    <Component {...pageProps} />
  </WagmiConfig>
}

export default MyApp
