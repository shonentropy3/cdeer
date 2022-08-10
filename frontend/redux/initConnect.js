import { hooks as walletConnectHooks, walletConnect } from '../connectors/walletConnect';
import { hooks as metaMaskHooks, metaMask } from '../connectors/metaMask';

import { useEffect, useState } from 'react';

import MetaMask from './metaMask';
import WalletConnect from './walletconnect';
// export const disInjected = async() => {
//   await metaMask.deactivate()
// }

// export const disWalletconnect = async() => {
//   await walletConnect.deactivate()
// }

// export const disConnect = {
//   injected: disInjected,
//   walletConnect: disWalletconnect,
// }

export default function InitConnect(params) {

  const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = metaMaskHooks; 

  const obj = {
    chainId : useChainId(),
    accounts : useAccounts(),
    isActivating : useIsActivating(),
    isActive : useIsActive(),
    provider : useProvider(),
    ENSNames : useENSNames()
  }
  const { provider } = params

  const injected = async() => {
    await metaMask.activate();
  }
    
  const walletconnect = async() => {
    await walletConnect.activate()
    .catch(err => {
      console.log(err);
    })
  } 
  
  const initConnect = {
    metaMask: injected,
    walletConnect: walletconnect,
  };

  const initHooks = () => {
    switch (provider) {
      case "metaMask":
        return  <MetaMask/>
      case "walletConnect":
        return  <WalletConnect/>

      default:
        break;
    }
  }

  useEffect(() => {
    if (provider !== undefined && provider !== null) {
      initConnect[provider]()
    }
  },[provider])

  return <>
    { initHooks() }
  </>
  
}