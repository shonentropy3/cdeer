import demand from '../../deployments/abi/Demand.json'
import demandAddr from '../contracts/deployments/Demand.json'
import { ethers } from 'ethers'

export default async function ModifyDemand(account) {

  try {
          if (window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const demandContract = new ethers.Contract(demandAddr.address, demand.abi, signer);
        let fee = ethers.utils.parseEther("9")
          await demandContract.modifyDemand(8,
            { 
                title: account.title,
                budget: fee,
                desc: account.pro_content,
                attachment: "attachment",
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