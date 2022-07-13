import demand from '../../deployments/abi/Demand.json'
import demandAddr from '../contracts/deployments/Demand.json'
import { ethers } from 'ethers'

export default async function ModifyDemand(account) {

  try {
          if (window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const demandContract = new ethers.Contract(demandAddr.address, demand.abi, signer);
          await demandContract.modifyDemand(account.pro_id,
            { 
                title: account.title,
                budget: ethers.utils.parseEther(`${account.budget}`),
                desc: account.pro_content,
                attachment: account.attachment,
                period: account.period,
                applySwitch: false
            });
        } else {
          console.log("Ethereum object does not exist");
        }
      } catch (err) {
        console.log(err);
          return err;
      }
}