import demand from '../../deployments/abi/Demand.json'
import demandAddr from '../contracts/deployments/Demand.json'
import { ethers } from 'ethers'


export default async function Demand(para) {
    try {
          
        if (window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const demandContract = new ethers.Contract(demandAddr.address, demand.abi, signer);
        let fee = ethers.utils.parseEther("1")
        const data = JSON.parse(para.proLabel)
        let budget = data.budget * 100
        let period = data.period * 24 * 60 * 60
          return await demandContract.createTask(
            { 
                title: data.title,
                desc: data.pro_content,
                attachment: data.hash,
                budget: budget,
                period: period
            },
            {
                value: fee
            })
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