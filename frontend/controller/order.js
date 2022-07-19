import orderAddr from '../contracts/deployments/Order.json'
import order from '../../deployments/abi/Order.json'
import { ethers } from 'ethers'


export default async function Order(para) {
    try {
          
        if (window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const demandContract = new ethers.Contract(orderAddr.address, order.abi, signer);
        const data = JSON.parse(para.proLabel)
        console.log('data==>',data);
        // return
          return await demandContract.createOrder(
            { 
                demandId: data.demandId,
                applyAddr: data.applyAddr,
                token: '',
                amount: data.amount,
                checked: '',
                startDate: ''
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