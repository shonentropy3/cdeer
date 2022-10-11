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
import intl from 'react-intl-universal';
import { ChangeLanguage } from "../utils/ChangeLanguage";

require('intl/locale-data/jsonp/en.js');
require('intl/locale-data/jsonp/zh.js');
const locales = {
  'en_US': require('../locales/en-US.json'),
  'zh_CN': require('../locales/zh-CN.json'),
};

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
import { useEffect, useState } from 'react'
import { emit } from '../locales/emit'


const {chains, provider} = configureChains([chain.mainnet,chain.goerli,chain.hardhat],[
  infuraProvider({ apiKey: 'd3fe47cdbf454c9584113d05a918694f' }),
  jsonRpcProvider({
    rpc: (chain) => ({ http: chain.rpcUrls.default }),
  }),
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

  // let [language,setLanguage] = useState('zh_CN')
  // let [initDone,setInitDone] = useState(false)

  // const loadLocales = () => {
  //   intl.init({
  //       currentLocale: ChangeLanguage(),  // 设置初始语言
  //       locales
  //   })
  //   .then(() => {
  //     initDone = true
  //     setInitDone(initDone)
  //   })
  // }

  // const change = (value) => {
  //   language = value
  //   setLanguage(language)
  // }

  // useEffect(() => {
  //   emit.on('change_language', () => loadLocales( ChangeLanguage() )); // 监听语言改变事件
  //   loadLocales(); // 初始化语言
  // },[])

  // return initDone &&
  return <>
    <WagmiConfig client={client} >
      {/* <Header setLan={change} language={language} ></Header> */}
      <Header></Header>
      <Component {...pageProps} />
    </WagmiConfig>
  </>
}

export default MyApp
