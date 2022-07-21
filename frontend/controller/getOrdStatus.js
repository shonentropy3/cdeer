import orderAddr from '../contracts/deployments/Order.json'
import order from '../../deployments/abi/Order.json'
import { ethers } from 'ethers'


export const getFirstStatus = async(para) => {
    try {
          
        if (window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const orderContract = new ethers.Contract(orderAddr.address, order.abi, signer);
        const data = JSON.parse(para.proLabel)
        return await orderContract.applyOrderIds(data.demand_id, data.apply_addr)
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

export const getSecondStatus =   async(para) => {
  try {
        
      if (window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const orderContract = new ethers.Contract(orderAddr.address, order.abi, signer);
      console.log("para==========",para);
      return await orderContract.orders(1)
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