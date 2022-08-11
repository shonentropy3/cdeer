import { useDispatch } from 'react-redux'
import { changeValue } from './web3_reactSlice';
import { hooks, walletConnect } from '../connectors/walletConnect';
import { useEffect } from 'react';

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks; 

export default function WalletConnect() {
    const dispatch = useDispatch();
    const obj = {
        chainId : useChainId(),
        accounts : useAccounts(),
        isActivating : useIsActivating(),
        isActive : useIsActive(),
        provider : useProvider(),
        ENSNames : useENSNames()
    }
    useEffect(() => {
        async function init() {
            await walletConnect.activate()
            .catch(err => {
                console.log(err);
            })
            dispatch(changeValue(obj));
        }
        if (walletConnect.provider) {
            init()
        }
    },[obj.provider])
    return <>
    {/* <h1>metamask</h1> */}
    </>
}