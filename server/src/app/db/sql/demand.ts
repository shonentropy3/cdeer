

export const getDemandDate = () => {
    let sql = `SELECT * FROM public."demand" WHERE del != 0 `
    return sql
}

export const getDemandInfoDate = params => {
    let sql = `SELECT * FROM public.demand WHERE id = '${params}' and del != 0 `
    return sql
}

export const getMyPjcDBa = params => {
    let sql = `SELECT * FROM public.demand WHERE demand_addr = '${params}' and del != 0 `
    return sql
}

export const getMyPjcDBb = params => {
    let sql = `SELECT * FROM public.demand WHERE demand_id = '${params}' and del != 0 `
    return sql
}

export const setDemand = params => {
    let sql = ` insert into project(user_address,title,budget,period,"content",role,pro_type, status, attachment) 
            VALUES (${params.u_address},'${params.title}',${params.budget},${params.period},'${params.pro_content}',
            ${params.recruiting_role},${params.pro_type},2,'${params.hash}') `;
    return sql
}

export const moDemand = params => {
    let sql = ` update project SET title = '${params.title}', budget = ${params.budget}, period = ${params.budget} ,
            "content" = '${params.pro_content}' ,role = '${params.recruiting_role}' ,pro_type = '${params.pro_type}',
            attachment = '${params.attachment}' ,status = 3 ,update_time = now() where pro_id = ${params.pro_id} `;
    return sql
}

export const delDemand = params => {
    let sql = ` UPDATE project SET status = 0  WHERE id = ${params.id} `;
    return sql
}

export const setApply = params => {
    let sql = ` insert into apply_info("apply_addr", demand_id, preview_price) 
            VALUES ('${params.applyAddr}', ${params.demandId}, ${params.previewPrice}) `;
    return sql
}

export const getApply = params => {
    let sql = `SELECT * FROM apply_info WHERE apply_addr = '${params}' `
    return sql
}

export const delApply = params => {
    let sql = `DELETE FROM apply_info WHERE demand_id = '${params}' `
    return sql
}