

export const getDemandDate = () => {
    let sql = `SELECT * FROM public."demand" WHERE del = 0 `
    return sql
}

export const getDemandInfoDate = params => {
    let sql = `SELECT * FROM public.demand WHERE id = '${params}' and del = 0 `
    return sql
}

export const getMyPjcDBa = params => {
    let sql = `SELECT * FROM public.demand WHERE demand_addr = '${params}' and del = 0 `
    return sql
}

export const getMyPjcDBb = params => {
    let sql = `SELECT * FROM public.demand WHERE demand_id = '${params}' and del = 0 `
    return sql
}

export const setDemand = params => {
    let sql = `
            insert into demand(demand_addr, demand_desc, role, demand_type) 
            VALUES (${params.u_address},'${params.pro_content}', ${params.recruiting_role},${params.demand_type});
        `;
    return sql
}

export const moDemand = params => {
    let sql = ` update demand SET title = '${params.title}', budget = ${params.budget}, period = ${params.period} ,
            demand_desc = '${params.pro_content}' ,role = '${params.recruiting_role}' ,demand_type = '${params.demand_type}',
            attachment = '${params.attachment}', update_time = now() where demand_id = ${params.demand_id} `;
    return sql
}

export const delDemand = params => {
    let sql = ` UPDATE demand SET status = 0  WHERE id = ${params.id} `;
    return sql
}

export const setApply = params => {
    let sql = ` insert into apply_info("apply_addr", demand_id, estimated_price) 
            VALUES ('${params.applyAddr}', ${params.demandId}, ${params.valuation}) `;
    return sql
}

export const getApply = params => {
    let sql = `SELECT * FROM apply_info WHERE apply_addr = '${params}' `
    return sql
}

export const delApply = params => {
    let sql = `DELETE FROM apply_info WHERE demand_id = '${params.demandId}' and apply_addr = '${params.applyAddr}'`
    console.log(sql);
    
    return sql
}

export const modifyApplySwitch = params => {
    let sql = `UPDATE demand SET apply_switch = ${params.buttonSwitch}  WHERE demand_id = '${params.demandId}'`
    return sql
}