import '../styles/globals.css'
import '../styles/Index.scss'
import '../styles/Projects.scss'
import '../styles/Publish.scss'
import '../styles/Parts.scss'
import Header from './parts/Header'

function MyApp({ Component, pageProps }) {
  return <>
    <Header></Header>
    <Component {...pageProps} />
  </>
}

export default MyApp
