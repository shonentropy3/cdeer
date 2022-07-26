import task from '../../deployments/abi/Task.json'
import taskAddr from '../contracts/deployments/Task.json'
import { ethers } from 'ethers'

export const ApplyProject = async(account) => {
  try {
    
    if (window.ethereum !== 'undefined') {
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const taskContract = new ethers.Contract(taskAddr.address, task.abi, signer);
      let data = JSON.parse(account)
      let valuation = data.valuation * 100
      return await taskContract.applyFor(
        Number(data.demandId),
        valuation
        )
        .then(res => {
          return res.hash
        })
    } else {
      console.log("Ethereum object does not exist");
    }
  } catch (err) {
          return err;
  }
}

export const CancelApply = async(account) => {
  try {
    if (window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const taskContract = new ethers.Contract(taskAddr.address, task.abi, signer);
      return await taskContract.cancelApply(account.demandId)
      .then(res => {
        return res
        })
      } else {
      console.log("Ethereum object does not exist");
    }
  } catch (err) {
          return err;
  }
}