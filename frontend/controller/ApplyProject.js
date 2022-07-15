import demand from '../../deployments/abi/Demand.json'
import demandAddr from '../contracts/deployments/Demand.json'
import { ethers } from 'ethers'

export default async function ApplyProject(account) {
  

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

// export async function CancelApply(account) {
//   try {
//     if (window.ethereum !== 'undefined') {
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const demandContract = new ethers.Contract(demandAddr.address, demand.abi, signer);
//       let data = JSON.parse(account)
//       await demandContract.cancelApply(data.demandId);
//     } else {
//       console.log("Ethereum object does not exist");
//     }
//   } catch (err) {
//           return err;
//   }
// }

// export async function ModifyApplySwitch(account) {
//   try {
//     if (window.ethereum !== 'undefined') {
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const demandContract = new ethers.Contract(demandAddr.address, demand.abi, signer);
//       let data = JSON.parse(account)
//       await demandContract.cancelApply(data.demandId, data.buttonSwitch);
//     } else {
//       console.log("Ethereum object does not exist");
//     }
//   } catch (err) {
//           return err;
//   }
// }