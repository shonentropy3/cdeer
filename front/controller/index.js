import { useContractWrite, useProvider, useSigner, useContractReads, useContractRead } from 'wagmi';
import task from '../../deployments/abi/DeTask.json'
import taskAddr from '../../deployments/dev/DeTask.json'
import order from '../../deployments/abi/DeOrder.json'
import orderAddr from '../../deployments/dev/DeOrder.json'

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

  const useTaskContractWrite = useContractWrite(taskConfig)

  const useOrderContractWrite = useContractWrite(orderConfig)

  return { 
    useTaskContractWrite, 
    taskConfig, 
    useOrderContractWrite, 
    orderConfig 
  }
}

export function useContractsRead(functionName,params) {
  const orderConfig = {
      addressOrName: orderAddr.address,
      contractInterface: order.abi,
      functionName: functionName,
      args: params
  }

  const useOrderContractRead = useContractRead(orderConfig)

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