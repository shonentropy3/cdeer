import demand from '../../deployments/abi/Demand.json'
import demandAddr from '../contracts/deployments/Demand.json'
import { ethers } from 'ethers'

export const ApplyProject = async(account) => {
  try {
    
    if (window.ethereum !== 'undefined') {
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const demandContract = new ethers.Contract(demandAddr.address, demand.abi, signer);
      let data = JSON.parse(account)
      console.log('=====',data);
      return await demandContract.applyFor(
        Number(data.demandId),
        data.previewPrice
        )
        .then(res => {
          let obj = {
            applyAddr: res.from,
            hash: res.hash
          }
          return obj
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
      const demandContract = new ethers.Contract(demandAddr.address, demand.abi, signer);
      return await demandContract.cancelApply(account.demandId)
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