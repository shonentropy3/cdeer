import { ethers } from 'ethers';

const dbUtil = require('../../db/dbUtil');
const db = require('../../db/postgresql');
const result = require('../../com/utils/result');
const getAccountInfo = require('../insertLog/insertLog')


function _fail(msg) {
    return { 'status': '0', 'message': msg };
}

function _succeed(extraData) {
    let base = { 'status': '1', 'message': 'OK' };
    return Object.assign(base, extraData)
}

async function createProject(ctx) {
    let queryData = ctx.request.body;
    let{proType,pro} = queryData;
    const { ethereum } = window;
    try {
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(contractAddress.address, abi, signer);
          getAccountInfo.insertLabel(proType)

          //Project publishing fee
          let fee = ethers.utils.parseUnits('1', 18);
          let nftTxn = await nftContract.createProject({
            title: pro[0].value,
            budget: Number(pro[1].value),
            requirements: pro[3].value,
            period: Number(pro[2].value)
          },
           {
            value: fee
           });
          await nftTxn.wait();
        } else {
          console.log("Ethereum object does not exist");
        }
  
      } 
      catch (err) {
        ctx.response.body = _fail(err);
        return;
      }
    return ctx.response.body = _succeed();
}

async function apply(ctx) {
    let queryData = ctx.request.body;
    let{proType,pro} = queryData;
    const { ethereum } = window;
    try {
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(contractAddress.address, abi, signer);
          getAccountInfo.insertLabel(proType)

          //Project publishing fee
          let fee = ethers.utils.parseUnits('1', 18);
          let nftTxn = await nftContract.createProject({
            title: pro[0].value,
            budget: Number(pro[1].value),
            requirements: pro[3].value,
            period: Number(pro[2].value)
          },
           {
            value: fee
           });
          await nftTxn.wait();
        } else {
          console.log("Ethereum object does not exist");
        }
  
      } 
      catch (err) {
        ctx.response.body = _fail(err);
        return;
      }
    return ctx.response.body = _succeed();
}



module.exports = {
    createProject,
    apply,
};