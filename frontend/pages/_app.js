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
// import { getName } from '../utils'
import store from '../redux/store'
import { Provider } from 'react-redux'

import {
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains,
  chain
} from 'wagmi'

import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

const connectors = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [network, networkHooks]
]


function MyApp({ Component, pageProps }) {

  const { chains, provider } = configureChains(
    [chain.mainnet, chain.polygon, chain.goerli],
    [
      jsonRpcProvider({
        rpc: (chain) => ({
          http: `https://goerli.infura.io/v3/d3fe47cdbf454c9584113d05a918694f`,
        }),
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

  return(
    <>
    {/* <Web3ReactProvider connectors={connectors}> */}
    <WagmiConfig client={client}>
      <Provider store={store}>
        <Header></Header>
        <Component {...pageProps} />
        {/* <Child /> */}
      </Provider>
      </WagmiConfig>
    {/* </Web3ReactProvider> */}
      
    </>
  )
}

export default MyApp
