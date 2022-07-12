

const { ethers } = require('ethers');
import 'ethers'
// import { async } from "rxjs";
const rpcProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const USDR_ADDR = require('../../deployments/Demand.json');




export const getLastBlock = () => {
    let obj = {
        table: 'block_log',
        keys: 'block',
        conditions: 'id = 0'
    }
    let sql = `SELECT ${obj.keys} FROM ${obj.table} WHERE ${obj.conditions};`
    return sql
}

export const updateProject = params => {
    let sql = `UPDATE project 
    SET user_address = temp.user_address, pro_id = temp.demandId, title = temp.title, budget = temp.budget, update_time = now()
    from (values ${params}) as temp (user_address, demandId,title, budget,content) where project.content=temp.content;
    `
    return sql
}

export const updateBlock = params => {
    let sql = `UPDATE block_log SET block = ${params} WHERE id = 0;`
    return sql 
}