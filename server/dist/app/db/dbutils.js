"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectDB = exports.getMarketDB = void 0;
const getMarketDB = () => {
    let sql = `SELECT * FROM public."project"`;
    return sql;
};
exports.getMarketDB = getMarketDB;
const getProjectDB = params => {
    let sql = `SELECT * FROM public.project WHERE id = '${params}'`;
    return sql;
};
exports.getProjectDB = getProjectDB;
//# sourceMappingURL=dbutils.js.map