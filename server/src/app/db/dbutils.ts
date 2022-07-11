

export const getMarketDB = () => {
    let sql = `SELECT * FROM public."project"`
    return sql
}

export const getProjectDB = params => {
    let sql = `SELECT * FROM public.project WHERE token_id = '${params}'`
    return sql
}