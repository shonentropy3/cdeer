
import { useDispatch } from 'react-redux'
import { metaMask } from '../connectors/metaMask';
import { walletConnect } from '../connectors/walletConnect';
import { clearValue } from './web3_reactSlice'


export default function DisConnect(params) {
    const dispatch = useDispatch();
    const { provider } = params;

    const injected = async() => {
        // await metaMask.deactivate();
    }

    const walletconnect = async() => {
        await walletConnect.deactivate();
    }

    const disConnect = {
        metaMask: injected,
        walletConnect: walletconnect, 
    }

    return  <>
        <p onClick={() => {
            disConnect[provider]()
            window.localStorage.removeItem('provider')
            dispatch(clearValue())
        }}>
            退出登陆
        </p>
    </>
}