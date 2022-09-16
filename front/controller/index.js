import { useContractWrite, useSignTypedData, useAccount, useContractReads, useContractRead, usePrepareContractWrite } from 'wagmi';
import task from '../../deployments/abi/DeTask.json'
import taskAddr from '../../deployments/dev/DeTask.json'
import order from '../../deployments/abi/DeOrder.json'
import orderAddr from '../../deployments/dev/DeOrder.json'
import stage from '../../deployments/abi/DeStage.json'
import stageAddr from '../../deployments/dev/DeStage.json'
import { useEffect, useState } from 'react';

export function useContracts(functionName) {

  // const signer = useSigner();
  // const provider = useProvider();
  const taskConfig = {
      addressOrName: taskAddr.address,
      contractInterface: task.abi,
      functionName: functionName,
  }
  const orderConfig = {
      addressOrName: orderAddr.address,
      contractInterface: order.abi,
      functionName: functionName,
  }
  const stageConfig = {
    addressOrName: stageAddr.address,
    contractInterface: stage.abi,
    functionName: functionName,
}

  const useTaskContractWrite = useContractWrite(taskConfig)

  const useOrderContractWrite = useContractWrite(orderConfig)

  const useStageContractWrite = useContractWrite(stageConfig)

  return { 
    useTaskContractWrite, 
    taskConfig, 
    useOrderContractWrite, 
    orderConfig,
    useStageContractWrite
  }
}

export function useContractsRead(functionName) {
  const orderConfig = {
    addressOrName: orderAddr.address,
    contractInterface: order.abi,
    functionName: functionName,
}

  const useOrderContractRead = useContractRead({
      addressOrName: orderAddr.address,
      contractInterface: order.abi,
      functionName: functionName,
  })

  return { useOrderContractRead, orderConfig }
}

export function useReads(functionName,list) {
  const orderConfig = {
      addressOrName: orderAddr.address,
      contractInterface: order.abi,
      functionName: functionName,
  }

  let arr = [];
  for (let i = 0; i < list.length; i++) {
    arr.push({
      ...orderConfig,
      args: list[i]
    })
  }

  const useOrderReads = useContractReads({
    contracts: arr
  })

  return { useOrderReads }
}

export function useStageReads(functionName,list) {
  const stageConfig = {
      addressOrName: stageAddr.address,
      contractInterface: stage.abi,
      functionName: functionName,
  }

  let arr = [];
  for (let i = 0; i < list.length; i++) {
    arr.push({
      ...stageConfig,
      args: list[i]
    })
  }

  const useStageReads = useContractReads({
    contracts: arr
  })

  return { useStageReads }
}

export function useSignData(params) {

  let obj = {
      chainId: params.chainId,
      contractAddress: orderAddr.address,
      owner: params.address,
      orderId: params.oid,
      amounts: params.amounts,
      periods: params.periods,
      nonce: params.nonce,  
      deadline: params.deadline,
  }

  const useSign = useSignTypedData({
    domain: {
      name: 'DetaskOrder',
      version: '1',
      chainId: obj.chainId,
      verifyingContract: obj.contractAddress,
    },
    types: {
      PermitStage: [
        { name: "orderId", type: "uint256" },
        { name: "amounts", type: "uint256[]" },
        { name: "periods", type: "uint256[]" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ]
    },
    value: {
      orderId: obj.orderId,
      amounts: obj.amounts,
      periods: obj.periods,
      nonce: obj.nonce,
      deadline: obj.deadline,
    },
    onError(error) {
      // console.log('Error', error)
    },
    onSuccess(data) {
      // console.log('Success', data)
    },
  })
  
  return { obj, params, useSign }
}

export function usePrepareContracts(functionName) {

  const { address } = useAccount();
  let [account,setAccount] = useState('');
  const { config, error } = usePrepareContractWrite({
    addressOrName: orderAddr.address,
    contractInterface: order.abi,
    functionName: functionName,
    args: account
  })

  const usePrepare = useContractWrite(config)

  const set = () => {
    account = address;
    setAccount(account);
  }

  useEffect(() => {
    address ? 
      set()
      :
      ''
  },[address])

  return { usePrepare, config }
}