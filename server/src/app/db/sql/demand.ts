

export const getDemandDate = () => {
    let sql = `SELECT * FROM public."tasks" WHERE del = 0 `
    return sql
}

export const getDemandInfoDate = params => {
    let sql = `SELECT * FROM public.tasks WHERE demand_id = '${params}' and del = 0 `
    return sql
}

export const getMyPjcDBa = params => {
    let sql = `SELECT * FROM public.tasks WHERE demand_addr = '${params}' and del = 0 `
    return sql
}

export const getMyPjcDBb = params => {
    let sql = `SELECT * FROM public.tasks WHERE demand_id = '${params}' and del = 0 `
    return sql
}

export const setDemand = params => {
    let sql = `
            insert into tasks(demand_addr, demand_desc, role, demand_type) 
            VALUES (${params.u_address},'${params.pro_content}', ${params.recruiting_role},${params.demand_type});
        `;
        
    return sql
}

export const moDemand = params => {
    let sql = ` update tasks SET title = '${params.title}', budget = ${params.budget}, period = ${params.period} ,
            demand_desc = '${params.pro_content}' ,role = '${params.recruiting_role}' ,demand_type = '${params.demand_type}',
            attachment = '${params.attachment}', update_time = now() where demand_id = ${params.demand_id} `;
    return sql
}

export const delDemand = params => {
    let sql = ` UPDATE tasks SET del = 1  WHERE id = ${params.id} `;
    return sql
}

export const setApply = params => {
    // let sql = ` insert into apply_info("apply_addr", demand_id, estimated_price) 
    //         VALUES ('${params.applyAddr}', ${params.demandId}, ${params.valuation}) `;

        let sql = ` insert into trans_hash("send_addr", demand_id, category, hash) 
            VALUES ('${params.applyAddr}', ${params.demandId}, 3, '${params.hash}')`;
            
    return sql
}

export const getApply = params => {
    let sql = `SELECT * FROM apply_info WHERE apply_addr = '${params}'`

    
    return sql
}

export const delApply = params => {
    let sqlBefore = `
        select * from trans_hash where send_addr = '${params.applyAddr}' and demand_id = '${params.demandId}' and is_update = 0 and category = 5;
    `
    let insertSql = `insert into trans_hash("send_addr", demand_id, category, hash) 
        VALUES ('${params.applyAddr}', ${params.demandId}, 5, '${params.hash}');
    `
    let updateSql = `UPDATE trans_hash SET send_addr = '${params.applyAddr}', update_time = now() 
        where trans_hash.hash= '${params.hash}';
    `
    let obj = {
        sqlBefore: sqlBefore,
        insertSql: insertSql,
        updateSql: updateSql
    }
    
    return obj
}

export const modifyApplySwitch = params => {
    let sql = `UPDATE tasks SET apply_switch = ${params.buttonSwitch}  WHERE demand_id = '${params.demandId}'`
    return sql
}