export const getMyApplylistA = params => {
    let sql = `SELECT * FROM public."apply_info" WHERE task_id = ${params} and sort = 1 `
    return sql
}

export const getMyApplylistB = params => {
    let sql = `SELECT * FROM public."apply_info" WHERE task_id = ${params} and sort = 0 `
    return sql
}

export const getApply = hash => {
    let sql = `SELECT task_id FROM public."apply_info" WHERE apply_addr = ${hash}`
    return sql
}