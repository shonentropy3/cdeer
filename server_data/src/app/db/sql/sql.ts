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
        UPDATE demand 
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
    let sql = `SELECT * FROM transHash WHERE use_type = ${use_type} and update = 0;`
    return sql
}

export const updateApplyInfo = (params) => {
    let sql = `
        if exists  (select 1 from apply_info where applyAddr = params.applyAddr and demand_id = params.demandId)
            BEGIN TRANSACTION;
                update apply_info set preview_price = params.previewPrice, update_time = now() 
                where applyAddr = '${params.applyAddr}' and demand_id = params.demandId;
                UPDATE trans_has 
                SET is_update = 1, update_time = now() 
                where trans_has.hash=params.hash;
            COMMIT;
        else
            BEGIN TRANSACTION;
                insert into apply_info(applyAddr, demand_id, preview_price) 
                VALUES ('${params.applyAddr}', ${params.demandId}, ${params.previewPrice});
                UPDATE trans_has 
                SET is_update = 1, update_time = now() where trans_has.hash=params.hash;
            COMMIT;
    `
    return sql
}

export const getApplyForHash = () => {
    let sql = `SELECT hash FROM trans_hash WHERE category = 3 and is_update = 0;`
    return sql
}

