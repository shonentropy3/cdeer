import { useContractWrite, useSignTypedData, useContractReads, useContractRead, useNetwork, useContract } from 'wagmi';
const task = require(`../../deployments/abi/DeTask.json`);
const taskAddr = require(`../../deployments/${process.env.NEXT_PUBLIC_DEVELOPMENT_CHAIN}/DeTask.json`);
const order = require(`../../deployments/abi/DeOrder.json`);
const orderAddr = require(`../../deployments/${process.env.NEXT_PUBLIC_DEVELOPMENT_CHAIN}/DeOrder.json`);
const stage = require(`../../deployments/abi/DeStage.json`);
const stageAddr = require(`../../deployments/${process.env.NEXT_PUBLIC_DEVELOPMENT_CHAIN}/DeStage.json`);
const orderVerifier = require(`../../deployments/abi/DeOrderVerifier.json`);
const orderVerifierAddr = require(`../../deployments/${process.env.NEXT_PUBLIC_DEVELOPMENT_CHAIN}/DeOrderVerifier.json`);
const weth = require(`../../deployments/abi/WETH.json`);
const wethAddr = require(`../../deployments/${process.env.NEXT_PUBLIC_DEVELOPMENT_CHAIN}/WETH.json`);

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

export function ConfigOrderVerifier(functionName) { 

  const orderConfig = {
    addressOrName: orderVerifierAddr.address,
    contractInterface: orderVerifier.abi,
    functionName: functionName,
  }
  return orderConfig
}

export function ConfigWeth(functionName) { 

  const wethConfig = {
    addressOrName: wethAddr.address,
    contractInterface: weth.abi,
    functionName: functionName,
  }
  return wethConfig
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

  const useWethContractWrite = useContractWrite(ConfigWeth(functionName))

  const test = ConfigOrder(functionName);

  return { useTaskContractWrite, useOrderContractWrite, test, useStageContractWrite, useWethContractWrite }
}

export function useRead(functionName,args) {

  let objA = {
    ...ConfigTask(functionName),
    args: args
  };
  let objB = {
    ...ConfigOrder(functionName),
    args: args
  };
  let objC = {
    ...ConfigStage(functionName),
    args: args
  };
  let objD = {
    ...ConfigOrderVerifier(functionName),
    args: args
  };
  let objE = {
    ...ConfigWeth(functionName),
    args: args
  };
  const useTaskRead = useContractRead(objA)
  const useOrderRead = useContractRead(objB)
  const useStageRead = useContractRead(objC)
  const useDeOrderVerifierRead = useContractRead(objD)
  const useWethRead = useContractRead(objE)

  return { useTaskRead, useOrderRead, useStageRead, useDeOrderVerifierRead, useWethRead }
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
  const useTaskReads = useContractReads({ contracts: arrB })
   
  const useOrderReads = useContractReads({ contracts: arr })

  const useStageReads = useContractReads({ contracts: arrA })


  return { useOrderReads, useStageReads, useTaskReads }
}

export function useSignData(params) {

  let obj = {
      chainId: params.chainId,
      contractAddress: orderVerifierAddr.address,
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
    contractAddress: orderVerifierAddr.address,
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
    contractAddress: orderVerifierAddr.address,
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

export function signParams(params) {
  if (isPermitTransferFrom(permit)) {
    validateTokenPermissions(permit.permitted)
    const types = witness ? permitTransferFromWithWitnessType(witness) : PERMIT_TRANSFER_FROM_TYPES
    const values = witness ? Object.assign(permit, { witness: witness.witness }) : permit
    return {
      types,
      values,
    }
  } else {
    permit.permitted.forEach(validateTokenPermissions)
    const types = witness ? permitBatchTransferFromWithWitnessType(witness) : PERMIT_BATCH_TRANSFER_FROM_TYPES
    const values = witness ? Object.assign(permit, { witness: witness.witness }) : permit
    return {
      types,
      values,
    }
}
}

export function useSignPermit2Data(params) {

  let obj = {
    chainId: params.chainId,
    token: params.token,
    amount: params.amount,
    spender: params.spender,
    nonce: params.nonce,
    deadline: params.deadline
  }
  
  const useSign = useSignTypedData({
    domain: {
      name: 'Permit2',
      version: '1',
      chainId: obj.chainId,
      verifyingContract: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
    },
    types: {
      PermitTransferFrom: [
        { name: 'permitted', type: 'TokenPermissions' },
        { name: 'spender', type: 'address' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
      TokenPermissions: [
        { name: 'token', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
    },
    value: {
      permitted: {
        token: obj.token,
        amount: obj.amount
      },
      spender: obj.spender,
      nonce: obj.nonce,
      deadline: obj.deadline
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
  console.log(contract);
  try {
    return await contract.methods.multicall(arr).send({from: address, gas: 1000000, value: total})
      .then(res => {
        return res.transactionHash
      })
  } catch(err) {
        console.log(err);
  }
}

export function muticallEncode(params) {
  const contract = new web3.eth.Contract(order.abi,orderAddr.address,)
  const contractVerifier = new web3.eth.Contract(orderVerifier.abi,orderVerifierAddr.address,)
  let arr = [];
  params.map(e => {
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
      case 8:
        console.log(contract.methods);
        var code = contract.methods[e.functionName](e.params[0],e.params[1],e.params[2],e.params[3],e.params[4],e.params[5],e.params[6],e.params[7]).encodeABI()
        arr.push(code)
        break;
      default:
        break;
    }
  })
  return arr
}
