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
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";


const getLibrary = (provider) => {
  return new Web3Provider(provider);
};
function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Web3ReactProvider getLibrary={getLibrary}>
      <Header />
      <Component {...pageProps} />
      </Web3ReactProvider>
    </div>
  )
}

export default MyApp
