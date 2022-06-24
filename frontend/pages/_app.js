import '../styles/globals.css'
import Header from './views/Header'
import 'antd/dist/antd.css'
// import '~antd/dist/antd.css';
import '../styles/header.scss'
import '../styles/market.scss';
import '../styles/publish.scss'
import '../styles/myproject.scss'
import '../styles/my.scss'
function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Header />
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp