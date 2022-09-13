import '../styles/globals.css'
import Header from './views/Header';
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

import {
  WagmiConfig,
  createClient,
  configureChains,
  chain,
  defaultChains
} from 'wagmi'

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { useEffect } from 'react'

const { chains, provider, webSocketProvider } = configureChains([chain.mainnet,chain.goerli,chain.hardhat],
  [
    infuraProvider({ apiKey: 'd3fe47cdbf454c9584113d05a918694f' }),
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default }),
    }),
  ],
)


// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),

  ],
  provider,
})


function MyApp({ Component, pageProps }) {

  useEffect(() => {
    // console.log(chain);
},[])
  return(
        <WagmiConfig client={client}>
            <Header></Header>
            <Component {...pageProps} />
        </WagmiConfig>
  )
}

export default MyApp
