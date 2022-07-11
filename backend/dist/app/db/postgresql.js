"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Select = exports.Insert = void 0;
const Insert = () => {
    let sql = `INSERT INTO public.project(
	id, user_address, pro_id, title, budget, period, role, pro_type, content, attachment, status, create_time, update_time)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    return sql;
};
exports.Insert = Insert;
const Select = (keys, table, conditions) => {
    let sql = `SELECT ${keys} FROM ${table} WHERE ${conditions};`;
    return sql;
};
exports.Select = Select;
//# sourceMappingURL=postgresql.js.map