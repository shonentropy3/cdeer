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
function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Header />
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
