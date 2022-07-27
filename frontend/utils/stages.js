import orderAddr from '../contracts/deployments/Order.json'
import order from '../../deployments/abi/Order.json'
import { ethers } from 'ethers'


// 获取阶段数据
export const getOrderStages = async(para) => {
    try {
        if (window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const demandContract = new ethers.Contract(orderAddr.address, order.abi, signer);
        const data = JSON.parse(para.proLabel)
        console.log('data==>',data);
        return await demandContract.orderStages(para.orderId)
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


// 终止订单(在issuer未确认阶段之前)
export const terminateOrder = async(para) => {
    try {
        if (window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const demandContract = new ethers.Contract(orderAddr.address, order.abi, signer);
        const data = JSON.parse(para.proLabel)
        console.log('data==>',data);
        return await demandContract.terminateOrder(data.orderId)
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

// 确认订单
export const confirmOrder = async(para) => {
  try {
      if (window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const demandContract = new ethers.Contract(orderAddr.address, order.abi, signer);
      const data = JSON.parse(para.proLabel)
      console.log(data,'==data==>');
      return await demandContract.confirmOrder(data.oid,{
        value: ethers.utils.parseEther(`${data.amount}`),
      })
          .then(res => {
            console.log(res,'res==>');
            if (res.hash) {
              return {
                code: 200
              }
            }else{
              return {code: 404}
            }
          })
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
        return err;
    }
}

// 确认阶段
export const confirmOrderStage = async(para) => {
    try {
        if (window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const demandContract = new ethers.Contract(orderAddr.address, order.abi, signer);
        const data = JSON.parse(para.proLabel)
        console.log('data==>',data);
        return await demandContract.confirmOrderStage(data.orderId, data.stageIndex)
            .then(res => {
              if (res.hash) {
                return {
                  code: 200
                }
              }else{
                return {
                  code: 404
                }
              }
            })
        } else {
          console.log("Ethereum object does not exist");
        }
      } catch (err) {
          return err;
      }
}

// 终止当前阶段
export const terminateStage = async(para) => {
    try {
        if (window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const demandContract = new ethers.Contract(orderAddr.address, order.abi, signer);
        const data = JSON.parse(para.proLabel)
        console.log('data==>',data);
        console.log(demandContract,'===>');
        // return await demandContract.terminateStage(data.orderId, data.stageIndex)
        
        return await demandContract.terminateStage("1",1)
            .then(res => {
                console.log(res,"=========res");
              if (res.hash) {
                return {
                  code: 200
                }
              }else{
                return res
              }
            })
        } else {
          console.log("Ethereum object does not exist");
        }
      } catch (err) {
          return err;
      }
}

// 提款当前阶段
export const withdraw = async(para) => {
    try {
        if (window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const demandContract = new ethers.Contract(orderAddr.address, order.abi, signer);
        const data = JSON.parse(para.proLabel)
        console.log('data==>',data);
        return await demandContract.withdraw(data.orderId, data.stageIndex)
            .then(res => {
              if (res.hash) {
                return {
                  code: 200
                }
              }else{
                return res
              }
            })
        } else {
          console.log("Ethereum object does not exist");
        }
      } catch (err) {
          return err;
      }
}