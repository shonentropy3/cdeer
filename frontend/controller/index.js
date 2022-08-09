import orderAddr from '../contracts/deployments/Order.json'
import order from '../../deployments/abi/Order.json'
import task from '../../deployments/abi/Task.json'
import taskAddr from '../contracts/deployments/Task.json'
import { ethers } from 'ethers'
import store from '../redux/store'

export const taskContract = () => {
    const web3 = store.getState().web3_react.value;
    const signer = web3.provider.getSigner(web3.accounts[0])
    const fun = new ethers.Contract(taskAddr.address, task.abi, signer);
    return fun;
}

export const orderContract = () => {
    const web3 = store.getState().web3_react.value;
    const signer = web3.provider.getSigner(web3.accounts[0])
    const fun = new ethers.Contract(orderAddr.address, order.abi, signer);
    return fun;
}