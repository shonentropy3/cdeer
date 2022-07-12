import demand from '../../deployments/abi/Demand.json'
import demandAddr from '../contracts/deployments/Demand.json'
import { ethers } from 'ethers'


export default async function ModifyDemand(demandId,account) {
    try {
          
        if (window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const demandContract = new ethers.Contract(demandAddr.address, demand.abi, signer);
        let fee = ethers.utils.parseEther("9")
          await demandContract.modifyDemand(demandId,
            { 
                title: "modifyDemand",
                budget: fee,
                desc: account[0].value,
                attachment: "modifyDemand",
                period: 123423
            });
        } else {
          console.log("Ethereum object does not exist");
        }
      } catch (err) {
          return err;
      }
}