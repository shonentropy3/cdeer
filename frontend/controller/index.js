import { useContractWrite, useProvider, useSigner, usePrepareContractWrite, useContractRead } from 'wagmi';
import task from '../../deployments/abi/Task.json'
import taskAddr from '../contracts/deployments/Task.json'
import order from '../../deployments/abi/Order.json'
import orderAddr from '../contracts/deployments/Order.json'
import hello from '../../deployments/abi/Hello.json'
import helloAddr from '../contracts/deployments/Hello.json'

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
  // const helloConfig = {
  //   addressOrName: helloAddr.address,
  //   contractInterface: hello.abi,
  //   functionName: functionName
  // }
  // const contract = useContract({
  //     ...taskConfig,
  //     signerOrProvider: signer.data || provider,
  //   });

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
  const taskConfig = {
    addressOrName: taskAddr.address,
    contractInterface: task.abi,
    functionName: functionName,
    args: params
  }
  const orderConfig = {
      addressOrName: orderAddr.address,
      contractInterface: order.abi,
      functionName: functionName,
      args: params
  }

  const useTaskContractRead = useContractRead(taskConfig)
  const useOrderContractRead = useContractRead(orderConfig)

  return {
    useTaskContractRead,
    useOrderContractRead
  }
}