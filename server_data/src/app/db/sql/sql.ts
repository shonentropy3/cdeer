export const getLastBlock = () => {
    let obj = {
        table: 'block_logs',
        keys: 'block',
        conditions: 'id = 0'
    }
    let sql = `SELECT ${obj.keys} FROM ${obj.table} WHERE ${obj.conditions};`
    return sql
}

export const getModifyDemandLastBlock = () => {
    let obj = {
        table: 'block_logs',
        keys: 'block',
        conditions: 'id = 1'
    }
    let sql = `SELECT ${obj.keys} FROM ${obj.table} WHERE ${obj.conditions};`
    return sql
}

// TODO:依据hash进行日志查看
export const updateProject = params => {
    let sql = `
        UPDATE tasks 
        SET id = temp.taskId, title = temp.title, "desc" = temp.content, budget = temp.budget,
        period = temp.period, attachment = temp.attachment, update_time = now() from (values ${params.value}) as temp (
            taskId, title, content, budget, period, attachment) where tasks.desc=temp.content;
    `
    console.log(sql);
    
    return sql
}

export const updateBlock = params => {
    let sql = `UPDATE block_logs SET block = ${params.latest} WHERE id = ${params.id};`
    return sql 
}

export const getHash = use_type => {
    let sql = `SELECT * FROM transHash WHERE use_type = ${use_type} and update = 0;`
    return sql
}

export const createTaskSql = (params) => {
    let sql = `
        UPDATE tasks 
        SET id = temp.taskId, title = temp.title, "desc" = temp.desc, budget = temp.budget,
        period = temp.period, attachment = temp.attachment, update_time = now() from (values (${params.taskId}, '${params.hash}',  
            '${params.title}', ${params.budget}, '${params.desc}', '${params.attachment}', ${params.period})) as temp (
            taskId, hash, title,  budget, "desc", attachment, period) where tasks.hash=temp.hash;
    `

    let sqlUpdateTH = ` 
        UPDATE trans_hashes SET is_update = 1, update_time = now() 
        where trans_hashes.hash= '${params.hash}';
    `
    let obj = {
        sql: sql,
        sqlUpdateTH: sqlUpdateTH
    }
    return obj
}

export const createOrderSql = (params) => {
    let sql = ` insert into orders("order_id", task_id, issuer, worker) 
    VALUES (${params.orderId}, ${params.taskId}, '${params.issuer}', '${params.worker}')`;
    // `
    //     UPDATE orders 
    //     SET order_id = temp.orderId,id = temp.taskId, worker = temp.worker, amount = temp.amount, update_time = now() 
    //     from (values (${params.orderId},${params.taskId}, '${params.hash}', '${params.worker}', ${params.amount}) as temp (orderId,
    //     taskId, hash, worker,  amount) where orders.hash=temp.hash;
    // `
    

    let sqlUpdateTH = ` 
        UPDATE trans_hashes SET is_update = 1, update_time = now() 
        where trans_hashes.hash= '${params.hash}';
    `
    let obj = {
        sql: sql,
        sqlUpdateTH: sqlUpdateTH
    }
    return obj
}


export const updateApplyInfo = (params) => {
    let sqlBefore = `
        select * from apply_info where apply_addr = '${params.applyAddr}' and task_id = '${params.taskId}'
    `
    
    let sqlUpdateAI = ` 
        update apply_info set price = ${params.valuation}, update_time = now() 
        where apply_addr = '${params.applyAddr}' and task_id = ${params.taskId};
    `

    let insert = ` 
        insert into apply_info(apply_addr, task_id, price) 
        VALUES ('${params.applyAddr}', ${params.taskId}, ${params.valuation});
    `

    let sqlUpdateTH = ` 
        UPDATE trans_hashes SET is_update = 1, update_time = now() 
        where trans_hashes.hash= '${params.hash}';
    `
    let obj = {
        sqlBefore: sqlBefore,
        sqlUpdateAI: sqlUpdateAI,
        insert: insert,
        sqlUpdateTH: sqlUpdateTH
    }
    return obj
}

export const getTaskHash = () => {
    let sql = `SELECT hash FROM trans_hashes WHERE category = 1 and is_update = 0;`
    return sql
}

export const getCreateOrderHash = () => {
    let sql = `SELECT hash FROM trans_hashes WHERE category = 6 and is_update = 0;`
    return sql
}

export const getApplyForHash = () => {
    let sql = `SELECT hash FROM trans_hashes WHERE category = 3 and is_update = 0;`
    return sql
}


export const getCancelApplyHash = () => {
    let sql = `SELECT hash FROM trans_hashes WHERE category = 5 and is_update = 0;`
    return sql
}

export const cancelApply = (params) => {
    let sqlBefore = `
        select * from apply_info where apply_addr = '${params.taker}' and task_id = '${params.taskId}'
    `
    let sqlDeletAI = ` 
        DELETE FROM apply_info WHERE apply_addr = '${params.taker}' and task_id = '${params.taskId}';
    `
    let sqlUpdateTH = ` 
        UPDATE trans_hashes SET is_update = 1, update_time = now() 
        where trans_hashes.hash= '${params.hash}';
    `

    let obj = {
        sqlBefore: sqlBefore,
        sqlDeletAI: sqlDeletAI,
        sqlUpdateTH: sqlUpdateTH
    }
    return obj
}

export const getCacheNfts = params => {
    let sql = `DELETE FROM nfts WHERE create_time <= ${params}`
    return sql
}

