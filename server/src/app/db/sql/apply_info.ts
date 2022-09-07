export const getMyApplylist = params => {
    let sql = `SELECT * FROM public."apply_info" WHERE task_id = ${params} `
    return sql
}

export const getApply = hash => {
    let sql = `SELECT task_id FROM public."apply_info" WHERE apply_addr = ${hash}`
    return sql
}