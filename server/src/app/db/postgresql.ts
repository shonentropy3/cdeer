



export const Insert = () => {
    let sql =`INSERT INTO public.project(
	id, user_address, pro_id, title, budget, period, role, pro_type, content, attachment, status, create_time, update_time)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    return sql
}

export const Select = (keys: String, table: String, conditions: String) => {
    let sql = `SELECT ${keys} FROM ${table} WHERE ${conditions};`
    return sql
}