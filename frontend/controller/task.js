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
        
        if (window.ethereum !== 'undefined') {
        // let fee = ethers.utils.parseEther("1")
        let fee = ethers.utils.parseEther("0")
        const data = JSON.parse(para.proLabel)
        let budget = data.budget * 100
        let period = data.period * 24 * 60 * 60
          return await taskContract().createTask(
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
              console.log(res);
              return res
            })
        } else {
          console.log("Ethereum object does not exist");
        }
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