import orderAddr from '../contracts/deployments/Order.json'
import order from '../../deployments/abi/Order.json'
import task from '../../deployments/abi/Task.json'
import taskAddr from '../contracts/deployments/Task.json'
import { ethers } from 'ethers'

export const taskContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const fun = new ethers.Contract(taskAddr.address, task.abi, signer);
    return fun;
}

export const orderContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const fun = new ethers.Contract(orderAddr.address, order.abi, signer);
    return fun;
}