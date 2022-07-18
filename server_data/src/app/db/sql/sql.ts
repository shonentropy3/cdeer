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

export const updateProject = params => {
    let sql = `
        UPDATE project 
        SET pro_id = temp.demandId, title = temp.title, budget = temp.budget, content = temp.content, 
        status = ${params.statusId},update_time = now() from (values ${params.value}) as temp (
        demandId, title, budget, content) where project.content=temp.content;
    `
    return sql
}

export const updateBlock = params => {
    let sql = `UPDATE block_log SET block = ${params.latest} WHERE id = ${params.id};`
    return sql 
}

export const getHash = use_type => {
    let sql = `SELECT * FROM info_sync_hash WHERE use_type = ${use_type} and update = 0;`
    return sql
}

export const updateApplyInfo = params => {
    let sql = `
        UPDATE apply_info 
        SET demand_id = temp.demandId, preview_price = temp.preview_price, update_time = now() 
        from (values ${params.value}) as temp (
        demandId, preview_price, transHash) where apply_info.transHash= ${params.value};
    `
    return sql
}