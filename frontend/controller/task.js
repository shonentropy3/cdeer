import { ethers } from 'ethers'
import { taskContract } from '.'





export const ModifyDemand = async(account) => {

  try {
    if (window.ethereum !== 'undefined') {
      let data = JSON.parse(account)
      let budget = data.budget * 100 
      let period = data.period * 24 * 60 * 60
      return await taskContract().modifyTask(data.demand_id,
        { 
            title: data.title,
            budget: budget,
            desc: data.pro_content,
            attachment: data.attachment,
            period: period,
            applyEnabled: true
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

export const Demand = async(para) => {
    try {
          // let fee = ethers.utils.parseEther("1")
          let fee = ethers.utils.parseEther("0")
          const data = JSON.parse(para.proLabel)
          let budget = data.budget * 100
          let period = data.period * 24 * 60 * 60
          let who = data.u_address
          console.log(data,'===>');
          return await taskContract().createTask(
            who,
            {
              title: data.title,
              desc: data.pro_content,
              attachment: data.hash,
              currency: 1,  //  币种,x10000,保留四位小数,前端只展示两位小数
              budget: budget,
              period: period,
              categories: 1,
              skills: 1,  //  原role,职业为1,2,3...整数型
            }
            ,
            {
                value: fee
            })
            .then(res => {
              console.log(res);
              return res
            })
        
      } catch (err) {
          return err;
      }
}

export const ApplyProject = async(account) => {
    try {
      if (window.ethereum !== 'undefined') {
        let data = JSON.parse(account)
        let valuation = data.valuation * 100
        return await taskContract().applyFor(
          Number(data.demandId),
          valuation
          )
          .then(res => {
            return res.hash
          })
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
            return err;
    }
}

export const CancelApply = async(account) => {
    try {
      if (window.ethereum !== 'undefined') {
        return await taskContract().cancelApply(account.demandId)
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