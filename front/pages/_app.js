import '../styles/globals.css'
import '../styles/Index.scss'
import '../styles/Projects.scss'
import '../styles/Project.scss'
import '../styles/Publish.scss'
import '../styles/Parts.scss'
import '../styles/Antd.scss'
import '../styles/All_User.scss'
import '../styles/Components.scss'
import '../iconfont/iconfont.css'
import Header from './parts/Header'
import Footer from './parts/Footer'

import {
  WagmiConfig,
  createClient,
  chain,
  configureChains,
} from 'wagmi'

import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { detectZoom } from '../utils/DetectZoom.js';
import { useEffect } from 'react'
import Web3 from 'web3'


const {chains, provider} = configureChains([chain.mainnet,chain.goerli,chain.hardhat,chain.polygonMumbai,{
  id: 8478,
  name: 'BuildBear',
  network: 'buildBear',
  rpcUrls: {
    // default: 'https://backend.buildbear.io/node/charming-bohr-99d0de',
    default: 'https://explorer.buildbear.io/node/charming-bohr-99d0de'
  },
}],[
  infuraProvider({ apiKey: 'd3fe47cdbf454c9584113d05a918694f' }),
  jsonRpcProvider({
    rpc: (chain) => ({ http: chain.rpcUrls.default }),
  })
])

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
  
  const zoom = (m) => {
    if (window.screen.width * window.devicePixelRatio >=3840) {
      switch (m) {
        // 4k ==> 100%
        case 100:
          document.body.style.zoom = 100 / (0.625 * 1920);
          break;
          // 4k ==> 125%
        case 125:
          document.body.style.zoom = 100 / (0.625 * 1920);
          break;
          // 4k ==> 150%
        case 150:
          document.body.style.zoom = 100 / (0.75 * 1920);
          break;
          // 4k ==> 175%
        case 175:
          document.body.style.zoom = 100 / (0.874715 * 1920);
          break;
          // 4k ==> 200%
        case 200:
          document.body.style.zoom = 1920 / 1920;
          break;
          // 4k ==> 225%
        case 225:
          document.body.style.zoom = 100 / (1.12485 * 1920);
          break;
      
        default:
          break;
      }
    }
    else if(m === 100 && window.devicePixelRatio === 1){
      document.body.style.zoom = window.screen.width / 1920;
      // console.log('正常屏');
      // console.log(window.screen.width + "====" + window.devicePixelRatio);
    }
    else if (window.screen.width <= 1915) {
      document.body.style.zoom = 1440 / 1920;
      // console.log('笔记本');
      // console.log(window.screen.width + "====" + window.devicePixelRatio);
    }
  }

  useEffect(() => {
    zoom(detectZoom());
  },[])

  return (
    // initDone &&
    <>
      <WagmiConfig client={client} >
        {/* <Header setLan={change} language={language} ></Header> */}
        <Header></Header>
        <Component {...pageProps} />
        <Footer />
      </WagmiConfig>
    </>
  )
}

export default MyApp
