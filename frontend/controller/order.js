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

        return await demandContract.createOrder(
          { 
              demandId: data.demandId,
              taker: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
              token: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
              amount: ethers.utils.parseEther("5"),
              checked: 1,
              startDate: 123423
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