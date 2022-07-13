import demand from '../../deployments/abi/Demand.json'
import demandAddr from '../contracts/deployments/Demand.json'
import { ethers } from 'ethers'


export default async function Demand(para) {
  console.log('window==>',window);
    try {
          
        if (window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const demandContract = new ethers.Contract(demandAddr.address, demand.abi, signer);
        let fee = ethers.utils.parseEther("7")
        const data = JSON.parse(para.proLabel)
        console.log('==>',data); 
      
          await demandContract.createDemand(
            { 
                title: data.title,
                desc: data.pro_content,
                attachment: data.hash,
                budget: fee,
                period: data.period
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