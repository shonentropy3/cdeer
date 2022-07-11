"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.last_check_block = exports.Insert = void 0;
const postgresql_1 = require("./postgresql");
const Insert = () => {
    let sql = `SELECT role,pro_type FROM project WHERE desc = 'xx';`;
    return sql;
};
exports.Insert = Insert;
const last_check_block = () => {
    return (0, postgresql_1.Select)('block', 'block_log', 'id = 0');
};
exports.last_check_block = last_check_block;
//# sourceMappingURL=dbutils.js.map