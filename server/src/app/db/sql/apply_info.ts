export const getMyApplylist = params => {
    let sql = `SELECT * FROM public."apply_info" WHERE demand_id = ${params} `
    return sql
}