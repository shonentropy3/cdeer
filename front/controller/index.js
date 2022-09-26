import { useContractWrite, useSignTypedData, useAccount, useContractReads, useContractRead, usePrepareContractWrite, useContract, useProvider } from 'wagmi';
import task from '../../deployments/abi/DeTask.json'
import taskAddr from '../../deployments/dev/DeTask.json'
import order from '../../deployments/abi/DeOrder.json'
import orderAddr from '../../deployments/dev/DeOrder.json'
import stage from '../../deployments/abi/DeStage.json'
import stageAddr from '../../deployments/dev/DeStage.json'
var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");

export function ConfigTask(functionName) { 
  let taskConfig = {
    addressOrName: taskAddr.address,
    contractInterface: task.abi,
    functionName: functionName,
  }
  return taskConfig
}

export function ConfigOrder(functionName) { 
  const orderConfig = {
    addressOrName: orderAddr.address,
    contractInterface: order.abi,
    functionName: functionName,
  }
  return orderConfig
}

export function ConfigStage(functionName) { 
  const stageConfig = {
    addressOrName: stageAddr.address,
    contractInterface: stage.abi,
    functionName: functionName,
  }
  return stageConfig
}

export function useContracts(functionName) {

  const useTaskContractWrite = useContractWrite(ConfigTask(functionName))

  const useOrderContractWrite = useContractWrite(ConfigOrder(functionName))

  const useStageContractWrite = useContractWrite(ConfigStage(functionName))

  return { useTaskContractWrite, useOrderContractWrite, useStageContractWrite }
}

export function useRead(functionName) {

  const useTaskRead = useContractRead(ConfigTask(functionName))
  const useOrderRead = useContractRead(ConfigOrder(functionName))
  const useStageRead = useContractRead(ConfigStage(functionName))

  return { useTaskRead, useOrderRead, useStageRead }
}

export function useReads(functionName,list) {
  let arr = [];
  let arrA = [];
  let arrB = [];
  for (let i = 0; i < list.length; i++) {
    arr.push({
      ...ConfigOrder(functionName),
      args: list[i]
    })
    arrA.push({
      ...ConfigStage(functionName),
      args: list[i]
    })
    arrB.push({
      ...ConfigTask(functionName),
      args: list[i]
    })
  }
  
  const useOrderReads = useContractReads({ contracts: arr })

  const useStageReads = useContractReads({ contracts: arrA })

  const useTaskReads = useContractReads({ contracts: arrB })

  return { useOrderReads, useStageReads, useTaskReads }
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

export function useSignAppendData(params) {

  let obj = {
    chainId: params.chainId,
    contractAddress: orderAddr.address,
    orderId: params.orderId,
    amount: params.amount,
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
      PermitAppendStage: [
        { name: "orderId", type: "uint256" },
        { name: "amount", type: "uint256" },
        { name: "period", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ]
    },
    value: {
      orderId: obj.orderId,
      amount: obj.amount,
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