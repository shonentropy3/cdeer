import { orderContract } from ".";
import { ethers } from 'ethers'

export const Order = async(para) => {
    try {
        if (window.ethereum !== 'undefined') {
        const data = JSON.parse(para.proLabel)
        return await orderContract().createOrder(
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
        console.log(para);
      return await orderContract().orders(para)
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
    const data = JSON.parse(para.proLabel)
    let arr = []
    data._amounts.forEach(ele => {
      arr.push(ethers.utils.parseEther(`${ele}`))
    });
    return await orderContract().setStage( data._orderId, data._token, arr, data._desc, data._periods )
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
    return await orderContract().getOrderStages(para)
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

export const getFirstStatus = async(para) => {
  try {
      if (window.ethereum !== 'undefined') {
      const data = JSON.parse(para.proLabel)
      return await orderContract().applyOrderIds(data.demand_id, data.apply_addr)
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

export const getSecondStatus = async(para) => {
try {
    if (window.ethereum !== 'undefined') {
    return await orderContract().orders(para)
      .then(res => {
        let obj = {
          amoumt: Number(res[3].toString())/1000000000000000000,
          check: res[4]
        }
          return obj
      })
    } else {
      console.log("Ethereum object does not exist");
    }
  } catch (err) {
      return err;
  }
}

// stage

// 获取阶段数据
export const getOrderStages = async(para) => {
  try {
      if (window.ethereum !== 'undefined') {
      return await orderContract().orderStages(para.orderId)
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
      const data = JSON.parse(para.proLabel)
      return await orderContract().terminateOrder(data.orderId)
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
    const data = JSON.parse(para.proLabel)
    return await orderContract().confirmOrder(data.oid,{
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
      const data = JSON.parse(para.proLabel)
      return await orderContract().confirmOrderStage(data.orderId, data.stageIndex)
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
      const data = JSON.parse(para.proLabel)
      console.log('data==>',data);
      return await orderContract().terminateStage("1",1)
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

// 提款当前阶段
export const withdraw = async(para) => {
  try {
      if (window.ethereum !== 'undefined') {
      const data = JSON.parse(para.proLabel)
      return await orderContract().withdraw(data.orderId, data.stageIndex)
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