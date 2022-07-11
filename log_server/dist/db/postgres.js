"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Select = exports.Update = exports.Insert = void 0;
const Insert = (obj) => {
    let sql = `
        SELECT ${obj.keys} FROM ${obj.table} WHERE ${obj.conditions};
    `;
    return sql;
};
exports.Insert = Insert;
const Update = () => {
};
exports.Update = Update;
const Select = (obj) => {
    let sql = `
        SELECT ${obj.keys} FROM ${obj.table} WHERE ${obj.conditions};
    `;
    return sql;
};
exports.Select = Select;
//# sourceMappingURL=postgres.js.map