import { Select } from "./postgresql";

export const Insert = () => {
    let sql =`SELECT role,pro_type FROM project WHERE desc = 'xx';`;
    return sql
}

export const last_check_block = () => {
    return Select('block','block_log','id = 0')
}