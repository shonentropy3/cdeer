import demand from '../../deployments/abi/Demand.json'
import demandAddr from '../contracts/deployments/Demand.json'
import { ethers } from 'ethers'


export default async function DeletDemand(para,account) {
    try {
          
        if (window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const demandContract = new ethers.Contract(demandAddr.address, demand.abi, signer);
          let fee = ethers.utils.parseEther("7")

          console.log("fee=======>",fee);
          await demandContract.createDemand(
            { 
                title: "test",
                desc: account[0].value,
                attachment: "attachment",
                budget: fee,
                period: 123423
            },
            {
                value: fee
            });
        } else {
          console.log("Ethereum object does not exist");
        }
      } catch (err) {
          return err;
      }
}