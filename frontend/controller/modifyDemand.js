import task from '../../deployments/abi/Task.json'
import taskAddr from '../contracts/deployments/Task.json'
import { ethers } from 'ethers'

export default async function ModifyDemand(account) {

  try {
    if (window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const taskContract = new ethers.Contract(taskAddr.address, task.abi, signer);
      let data = JSON.parse(account)
      console.log(data,'=====');
      let price =  data.budget * 100
      return await taskContract.modifyTask(data.demand_id,
        { 
            title: data.title,
            budget: price,
            desc: data.pro_content,
            attachment: data.attachment,
            period: data.period,
            applyEnable: false
        })
        .then(res => {
          console.log(res,'===>');
          return res
        })
    } else {
      console.log("Ethereum object does not exist");
    }
  } catch (err) {
      return err;
  }

}