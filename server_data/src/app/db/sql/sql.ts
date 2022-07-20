export const getLastBlock = () => {
    let obj = {
        table: 'block_log',
        keys: 'block',
        conditions: 'id = 0'
    }
    let sql = `SELECT ${obj.keys} FROM ${obj.table} WHERE ${obj.conditions};`
    return sql
}

export const getModifyDemandLastBlock = () => {
    let obj = {
        table: 'block_log',
        keys: 'block',
        conditions: 'id = 1'
    }
    let sql = `SELECT ${obj.keys} FROM ${obj.table} WHERE ${obj.conditions};`
    return sql
}

// TODO:依据hash进行日志查看
export const updateProject = params => {
    let sql = `
        UPDATE demand 
        SET demand_id = temp.demandId, title = temp.title, demand_desc = temp.content, budget = temp.budget,
        period = temp.period, attachment = temp.attachment, update_time = now() from (values ${params.value}) as temp (
        demandId, title, content, budget, period, attachment) where demand.demand_desc=temp.content;
    `
    return sql
}

export const updateBlock = params => {
    let sql = `UPDATE block_log SET block = ${params.latest} WHERE id = ${params.id};`
    return sql 
}

export const getHash = use_type => {
    let sql = `SELECT * FROM transHash WHERE use_type = ${use_type} and update = 0;`
    return sql
}

export const updateApplyInfo = (params) => {
    let sqlBefore = `
        select * from apply_info where apply_addr = '${params.applyAddr}' and demand_id = '${params.demandId}'
    `
    let sqlUpdateAI = ` 
        update apply_info set price = ${params.valuation}, update_time = now() 
        where apply_addr = '${params.applyAddr}' and demand_id = ${params.demandId};
    `

    let insert = ` 
        insert into apply_info(apply_addr, demand_id, price) 
        VALUES ('${params.applyAddr}', ${params.demandId}, ${params.valuation});
    `

    let sqlUpdateTH = ` 
        UPDATE trans_hash SET is_update = 1, update_time = now() 
        where trans_hash.hash= '${params.hash}';
    `
    let obj = {
        sqlBefore: sqlBefore,
        sqlUpdateAI: sqlUpdateAI,
        insert: insert,
        sqlUpdateTH: sqlUpdateTH
    }
    return obj
}

export const getApplyForHash = () => {
    let sql = `SELECT hash FROM trans_hash WHERE category = 3 and is_update = 0;`
    return sql
}


export const getCancelApplyHash = () => {
    let sql = `SELECT hash FROM trans_hash WHERE category = 5 and is_update = 0;`
    return sql
}

export const cancelApplyInfo = (params) => {
    let sqlBefore = `
        select * from apply_info where apply_addr = '${params.applyAddr}' and demand_id = '${params.demandId}'
    `
    let sqlDeletAI = ` 
        DELETE FROM apply_info WHERE apply_addr = '${params.applyAddr}' and demand_id = '${params.demandId}';
    `
    let sqlUpdateTH = ` 
        UPDATE trans_hash SET is_update = 1, update_time = now() 
        where trans_hash.hash= '${params.hash}';
    `

    let obj = {
        sqlBefore: sqlBefore,
        sqlDeletAI: sqlDeletAI,
        sqlUpdateTH: sqlUpdateTH
    }
    return obj
}

