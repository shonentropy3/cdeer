import { useContractWrite, useSignTypedData, useAccount, useContractReads, useContractRead, usePrepareContractWrite, useContract, useProvider } from 'wagmi';
import task from '../../deployments/abi/DeTask.json'
import taskAddr from '../../deployments/dev/DeTask.json'
import order from '../../deployments/abi/DeOrder.json'
import orderAddr from '../../deployments/dev/DeOrder.json'
import stage from '../../deployments/abi/DeStage.json'
import stageAddr from '../../deployments/dev/DeStage.json'
import { useEffect, useState } from 'react';
var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");

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

  const stageConfig = {
    addressOrName: stageAddr.address,
    contractInterface: stage.abi,
    functionName: functionName,
}

  let arr = [];
  let arrA = [];
  for (let i = 0; i < list.length; i++) {
    arr.push({
      ...orderConfig,
      args: list[i]
    })
    arrA.push({
      ...stageConfig,
      args: list[i]
    })
  }

  const useOrderReads = useContractReads({
    contracts: arr
  })

  const useStageReads = useContractReads({
    contracts: arrA
  })

  return { useOrderReads, useStageReads, stageConfig }
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

export function useSignProData(params) {

  let obj = {
    chainId: params.chainId,
    contractAddress: orderAddr.address,
    owner: params.address,
    orderId: params.orderId,
    stageIndex: params.stageIndex,
    period: params.period,
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
      PermitProStage: [
        { name: "orderId", type: "uint256" },
        { name: "stageIndex", type: "uint256" },
        { name: "period", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ]
    },
    value: {
      orderId: obj.orderId,
      stageIndex: obj.stageIndex,
      period: obj.period,
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

export function testContract(params) {
  const contract = new web3.eth.Contract(order.abi,orderAddr.address,)
  let arr = [];

  params.map(e => {
    // 
    switch (e.params.length) {
      case 0:
        var code = contract.methods[e.functionName]().encodeABI()
        arr.push(code)
        break;
      case 1:
        var code = contract.methods[e.functionName](e.params[0]).encodeABI()
        arr.push(code)
        break;
      case 2:
        var code = contract.methods[e.functionName](e.params[0],e.params[1]).encodeABI()
        arr.push(code)
        break; 
      case 3:
        var code = contract.methods[e.functionName](e.params[0],e.params[1],e.params[2]).encodeABI()
        arr.push(code)
        break;
      case 4:
        var code = contract.methods[e.functionName](e.params[0],e.params[1],e.params[2],e.params[3]).encodeABI()
        arr.push(code)
        break;
      case 5:
        var code = contract.methods[e.functionName](e.params[0],e.params[1],e.params[2],e.params[3],e.params[4]).encodeABI()
        arr.push(code)
        break;
      case 6:
        var code = contract.methods[e.functionName](e.params[0],e.params[1],e.params[2],e.params[3],e.params[4],e.params[5]).encodeABI()
        arr.push(code)
        break;
      case 7:
        var code = contract.methods[e.functionName](e.params[0],e.params[1],e.params[2],e.params[3],e.params[4],e.params[5],e.params[6]).encodeABI()
        arr.push(code)
        break;
      default:
        var code = contract.methods[e.functionName](e.params[0],e.params[1],e.params[2],e.params[3],e.params[4],e.params[5],e.params[6],e.params[7]).encodeABI()
        arr.push(code)
        break;
    }
  })
  return arr
}

export async function multicallWrite(arr,address,total) {
  const contract = new web3.eth.Contract(order.abi,orderAddr.address,)
  try {
    return await contract.methods.multicall(arr).send({from: address, gas: 1000000, value: total})
      .then(res => {
        console.log('index ===>',res);
      })
  } catch(err) {
        console.log(err);
  }
}
