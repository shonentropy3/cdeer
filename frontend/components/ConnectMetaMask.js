
import { useEffect } from 'react';
import { metaMask, hooks } from '../connectors/metaMask';
import { Button, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { changeValue } from '../redux/web3_reactSlice'

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks

export default function ConnectMetaMask(props) {

    const { cancel } = props;
    const web3_react = {
        chainId : useChainId(),
        accounts : useAccounts(),
        isActivating : useIsActivating(),
        isActive : useIsActive(),
        provider : useProvider(),
        ENSNames : useENSNames()
    }
    // redux
    const dispatch = useDispatch()
    

    useEffect(() => {
        void metaMask.connectEagerly().catch(() => {
          console.debug('Failed to connect eagerly to metamask')
        })
    }, [])

    const connect = async() => {
        await metaMask.activate();
        dispatch(changeValue(web3_react))
        window.localStorage.setItem("provider", "metaMask");
        if (web3_react.isActive) {
            cancel()
            message.success('登陆成功!')
            setTimeout(() => {
                history.go(0)
            }, 500);
        }
    }

    return <Button className="li" onClick={() => connect()} >Metamask</Button>
}