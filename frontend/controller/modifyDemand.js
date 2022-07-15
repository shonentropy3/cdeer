import demand from '../../deployments/abi/Demand.json'
import demandAddr from '../contracts/deployments/Demand.json'
import { ethers } from 'ethers'

export default async function ModifyDemand(account) {

  try {
    if (window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const demandContract = new ethers.Contract(demandAddr.address, demand.abi, signer);
      let data = JSON.parse(account)
      await demandContract.modifyDemand(data.pro_id,
        { 
            title: data.title,
            budget: data.budget,
            desc: data.pro_content,
            attachment: data.attachment,
            period: data.period,
            applySwitch: false
        });
    } else {
      console.log("Ethereum object does not exist");
    }
  } catch (err) {
      return err;
  }

}