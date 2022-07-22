export const getMyApplylist = params => {
    let sql = `SELECT * FROM public."apply_info" WHERE task_id = ${params} `
    return sql
}