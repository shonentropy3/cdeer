
import { useEffect } from 'react';
import { metaMask, hooks } from '../connectors/metaMask';
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { changeValue } from './web3_reactSlice'

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks

export default function ConnectMetaMask(props) {

    const { cancel } = props;
    const web3_react = {
        chainId : useChainId(),
        accounts : useAccounts(),
        isActivating : useIsActivating(),
        isActive : useIsActive(),
        provider : useProvider(),
        ENSNames : useENSNames(),
        wallet: metaMask
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
        cancel()
    }

    return <Button className="li" onClick={() => connect()} >Metamask</Button>
}