"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyPjcDB = exports.getProjectDB = exports.getMarketDB = void 0;
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
const getMyPjcDB = params => {
    let sql = `SELECT * FROM public.project WHERE user_address = '${params}' and status != 0 `;
    return sql;
};
exports.getMyPjcDB = getMyPjcDB;
//# sourceMappingURL=dbutils.js.map