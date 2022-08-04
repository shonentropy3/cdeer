
import { useEffect } from 'react';
import { metaMask, hooks } from '../connectors/metaMask';
import { Button } from 'antd';

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks

export default function ConnectMetaMask(props) {

    const { change } = props;
    const { cancel } = props;
    const web3_react = {
        chainId : useChainId(),
        accounts : useAccounts(),
        isActivating : useIsActivating(),
        isActive : useIsActive(),
        provider : useProvider(),
        ENSNames : useENSNames()
    }

    

    useEffect(() => {
        void metaMask.connectEagerly().catch(() => {
          console.debug('Failed to connect eagerly to metamask')
        })
    }, [])

    const connect = async() => {
        await metaMask.activate();
        // TODO:改为redux存储web3_react
        await change({...web3_react})
        cancel()
    }

    return <Button className="li" onClick={() => connect()} >Metamask</Button>
}