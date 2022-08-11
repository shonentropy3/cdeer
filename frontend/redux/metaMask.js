import { useDispatch } from 'react-redux'
import { changeValue } from './web3_reactSlice';
import { hooks, metaMask } from '../connectors/metaMask';
import { useEffect } from 'react';

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks; 

export default function MetaMask() {
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
            await metaMask.activate();
            dispatch(changeValue(obj));
        }
        if (metaMask.provider) {
            init()
        }
    },[obj.provider])
    return <>
    {/* <h1>metamask</h1> */}
    </>
}