import orderAddr from '../contracts/deployments/Order.json'
import order from '../../deployments/abi/Order.json'
import { ethers } from 'ethers'


export default async function getOrdStatus(para) {
    try {
          
        if (window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const orderContract = new ethers.Contract(orderAddr.address, order.abi, signer);
        const data = JSON.parse(para.proLabel)
        console.log('orderContract==>',orderContract.applyOrderIds);
        // await order.connect(accounts[3]).applyOrderIds(1,accounts[3].address);
        console.log("-=-============",data.apply_addr);
        return await orderContract.applyOrderIds(1,data.apply_addr)
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