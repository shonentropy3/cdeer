

export const getDemandDate = () => {
    let sql = `SELECT * FROM public."tasks" WHERE del = 0 and apply_switch = 1 `
    return sql
}

export const getOrdersDate = (account) => {
    let sql = `SELECT * FROM public."orders" WHERE worker = '${account}' `
    return sql
}

export const getIssuerOrdersDate = (account) => {
    let sql = `SELECT * FROM public."orders" WHERE issuer = '${account}' `
    return sql
}

export const getOrderInfo = (account) => {
    let sql = `SELECT * FROM public."orders" WHERE order_id = '${account}' `
    return sql
}

export const getDemandInfoDate = params => {
    let sql = `SELECT * FROM public.tasks WHERE id = '${params}' and del = 0`
    return sql
}

export const getMyPjcDBa = params => {
    let sql = `SELECT * FROM public.tasks WHERE issuer = '${params}' and del = 0 `
    return sql
}

export const getTaskApplyCount = params => {
    let sql = `SELECT * FROM public.apply_info WHERE task_id = '${params}'`
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
    if (!params.role&&!params.task_type) {
        role = '';
        type = '';
        and = '';
        where= '';
    }
    let sql = `SELECT * FROM public.tasks ${where} ${role} ${and} ${type}`
    return sql
}


export const setDemand = params => {
    let sql = ` insert into tasks(issuer, hash, "desc", role, suffix) 
            VALUES ('${params.u_address}','${params.payhash}','${params.pro_content}', ${params.recruiting_role}, '${params.suffix}');`;

    let sqlHash = ` insert into trans_hashes("send_addr", category, hash) 
        VALUES ('${params.u_address}', 1, '${params.payhash}');`;
    
    let obj = {
        sql: sql,
        sqlHash: sqlHash
    }
    return obj
}

export const updateTask = params => {
    let sqlUpdate = `update tasks SET issuer = '${params.u_address}', hash = ${params.payhash},
    "desc" = '${params.pro_content}' ,role = '${params.recruiting_role}' where id = ${params.task_id} ;`
    return sqlUpdate
}


export const moDemand = params => {
    let sql = ` update tasks SET title = '${params.title}', budget = ${params.budget}, period = ${params.period} ,
    "desc" = '${params.pro_content}' ,role = '${params.recruiting_role}' ,task_type = '${params.demand_type}',
            attachment = '${params.attachment}', update_time = now() where id = ${params.demand_id} `;
    return sql
}

export const delDemand = params => {
    let sql = ` UPDATE tasks SET del = 1  WHERE id = ${params.id} `;
    console.log(sql);
    
    return sql
}

export const setApply = params => {
    let sql = ` insert into trans_hashes("send_addr", task_id, category, hash) 
        VALUES ('${params.address}', ${params.demandId}, 3, '${params.hash}')`;
    return sql
}

export const setApplylist = params => {
    let sql = ` insert into apply_info(apply_addr, task_id, "desc", sort) 
        VALUES ('${params.address}', ${params.demandId}, '${params.desc}', 1)`;
    return sql
}

export const updateApply = params => {
    let sql = ` UPDATE apply_info set "desc" = '${params.desc}'
                where apply_addr = '${params.address}' and task_id = ${params.demandId}`;
    return sql
}

export const getMyApply = params => {
    let sql = `SELECT * FROM apply_info WHERE apply_addr = '${params.address}' and task_id = ${params.demandId}`
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

    let deldateSql = `DELETE from apply_info where apply_addr = '${params.applyAddr}' and task_id = '${params.demandId}'`

    let obj = {
        sqlBefore: sqlBefore,
        insertSql: insertSql,
        updateSql: updateSql,
        deldateSql: deldateSql
    }
    
    return obj
}

export const modifyApplySort = params => {
    let sql = `UPDATE apply_info SET sort = 0 WHERE task_id = '${params.taskId}' and apply_addr = '${params.address}'`
    return sql
}

export const modifyApplySwitch = params => {
    let sql = `UPDATE tasks SET apply_switch = ${params.buttonSwitch}  WHERE id = '${params.demandId}'`
    return sql
}

export const updateStageJson = params => {
    let sql = ` update orders SET attachment = '${params.json.hash}', signature = '${params.info.signature}',
                signaddress = '${params.info.signaddress}', stages = '${params.stages}' where order_id = '${params.oid}'`;
    return sql
}

export const updateSigner = params => {
    let sql = ` update orders SET signature = '${params.signature}',
                signaddress = '${params.signaddress}', stages = '${params.stages}', signnonce = '${params.nonce}' where order_id = '${params.oid}'`;
    return sql
}

export const getSigner = params => {
    let sql = ` SELECT signature, stages FROM public."orders" WHERE order_id = '${params}'`;
    return sql
}


export const updateJson = params => {
    let sql = ` update orders SET attachment = '${params.json.hash}' where order_id = '${params.oid}'`;
    return sql
}

export const getStageJson = params => {
    let sql = `SELECT * FROM public."orders" WHERE order_id = ${params} `
    return sql
}

export const getStages = params => {
    let sql = `SELECT * FROM public."orders" WHERE order_id = ${params} `
    return sql
}

// 
export const getSearchData = params => {
    let sql = `SELECT * FROM tasks where position('${params}' in title) > 0;`
    return sql
}