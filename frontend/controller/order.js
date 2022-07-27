import orderAddr from '../contracts/deployments/Order.json'
import order from '../../deployments/abi/Order.json'
import { ethers } from 'ethers'


export const Order = async(para) => {
    try {
        if (window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const demandContract = new ethers.Contract(orderAddr.address, order.abi, signer);
        const data = JSON.parse(para.proLabel)
        return await demandContract.createOrder(
          { 
              taskId: data.demandId,
              worker: data.applyAddr,
              token: data.token,
              amount: ethers.utils.parseEther(`${data.amount}`),
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

export const getOrderAmount = async(para) => {
  try {
      if (window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const orderContract = new ethers.Contract(orderAddr.address, order.abi, signer);
      // const data = JSON.parse(para.proLabel)
      return await orderContract.orders(para)
        .then(res => {
          return res.amount
        })
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
        return err;
    }
}

export const divideStage = async(para) => {
  try {
    if (window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const demandContract = new ethers.Contract(orderAddr.address, order.abi, signer);
    const data = JSON.parse(para.proLabel)
    let arr = []
    data._amounts.forEach(ele => {
      arr.push(ethers.utils.parseEther(`${ele}`))
    });
    return await demandContract.setStage( data._orderId, data._token, arr, data._desc, data._periods )
      .then(res => {
        if (res.hash) {
          return 200
        }else{
          return 'err'
        }
      })
    } else {
      console.log("Ethereum object does not exist");
    }
  } catch (err) {
      return err;
  }
}

export const orderStage = async(para) => {
  try {
    if (window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const orderContract = new ethers.Contract(orderAddr.address, order.abi, signer);
    return await orderContract.getOrderStages(para)
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