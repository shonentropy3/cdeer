import '../styles/globals.css'
import '../styles/Index.scss'
import '../styles/Parts.scss'
import Header from './parts/Header'

function MyApp({ Component, pageProps }) {
  return <>
    <Header></Header>
    <Component {...pageProps} />
  </>
}

export default MyApp
