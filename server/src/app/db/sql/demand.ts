

export const getDemandDate = () => {
    let sql = `SELECT * FROM public."project" WHERE status != 0 `
    return sql
}

export const getDemandInfoDate = params => {
    let sql = `SELECT * FROM public.project WHERE id = '${params}' and status != 0 `
    return sql
}

export const getMyPjcDBa = params => {
    let sql = `SELECT * FROM public.project WHERE user_address = '${params}' and status != 0 `
    return sql
}

export const getMyPjcDBb = params => {
    let sql = `SELECT * FROM public.project WHERE pro_id = '${params}' and status != 0 `
    return sql
}