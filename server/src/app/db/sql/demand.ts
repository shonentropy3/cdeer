

export const getDemandDate = () => {
    let sql = `SELECT * FROM public."project" WHERE status != 0 `
    return sql
}

export const getDemandInfoDate = params => {
    let sql = `SELECT * FROM public.project WHERE id = '${params}' and status != 0 `
    return sql
}

export const getMyPjcDB = params => {
    let sql = `SELECT * FROM public.project WHERE user_address = '${params}' and status != 0 `
    return sql
}