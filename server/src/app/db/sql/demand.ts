

export const getDemandDate = () => {
    let sql = `SELECT * FROM public."tasks" WHERE del = 0 `
    return sql
}

export const getDemandInfoDate = params => {
    let sql = `SELECT * FROM public.tasks WHERE id = '${params}' and del = 0 `
    return sql
}

export const getMyPjcDBa = params => {
    let sql = `SELECT * FROM public.tasks WHERE issuer = '${params}' and del = 0 `
    return sql
}

export const getMyPjcDBb = params => {
    let sql = `SELECT * FROM public.tasks WHERE id = '${params}' and del = 0 `
    return sql
}

export const getFilter = params => {
    let role = `cast(array['${params.role}'] as varchar[])&&role`;
    let and = ' and ';
    let where = 'WHERE';
    let type = `cast(array['${params.task_type}'] as varchar[])&&task_type`;

    if (!params.role) {
        role = '';
        and = '';
    }
    if (!params.task_type) {
        type = '';
        and = '';
    }
    if (!params.role&&!params.role) {
        role = '';
        type = '';
        and = '';
        where= '';
    }
    let sql = `SELECT * FROM public.tasks ${where} ${role} ${and} ${type}`
    return sql
}


export const setDemand = params => {
    let sql = `
            insert into tasks(issuer, hash, "desc", role, task_type) 
            VALUES ('${params.u_address}','${params.payhash}','${params.pro_content}', ${params.recruiting_role},${params.demand_type});
        `;

    let sqlHash = ` insert into trans_hashes("send_addr", category, hash) 
        VALUES ('${params.u_address}', 1, '${params.payhash}')`;
    console.log(sqlHash,'====?>');
    
    let obj = {
        sql: sql,
        sqlHash: sqlHash
    }
    return obj
}

export const moDemand = params => {
    let sql = ` update tasks SET title = '${params.title}', budget = ${params.budget}, period = ${params.period} ,
    "desc" = '${params.pro_content}' ,role = '${params.recruiting_role}' ,task_type = '${params.demand_type}',
            attachment = '${params.attachment}', update_time = now() where id = ${params.demand_id} `;
            console.log(sql);
            
    return sql
}

export const delDemand = params => {
    let sql = ` UPDATE tasks SET del = 1  WHERE id = ${params.id} `;
    return sql
}

export const setApply = params => {
    let sql = ` insert into trans_hashes("send_addr", task_id, category, hash) 
        VALUES ('${params.address}', ${params.demandId}, 3, '${params.hash}')`;
    return sql
}

export const getApply = params => {
    let sql = `SELECT * FROM apply_info WHERE apply_addr = '${params}'`

    
    return sql
}

export const delApply = params => {
    let sqlBefore = `
        select * from trans_hashes where send_addr = '${params.applyAddr}' and task_id = '${params.demandId}' and is_update = 0 and category = 5;
    `
    let insertSql = `insert into trans_hashes("send_addr", task_id, category, hash) 
        VALUES ('${params.applyAddr}', ${params.demandId}, 5, '${params.hash}');
    `
    let updateSql = `UPDATE trans_hashes SET send_addr = '${params.applyAddr}', update_time = now() 
        where trans_hashes.hash= '${params.hash}';
    `
    let obj = {
        sqlBefore: sqlBefore,
        insertSql: insertSql,
        updateSql: updateSql
    }
    
    return obj
}

export const modifyApplySwitch = params => {
    let sql = `UPDATE tasks SET apply_switch = ${params.buttonSwitch}  WHERE id = '${params.demandId}'`
    console.log(sql,'==>');
    
    return sql
}