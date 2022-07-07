"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging: JSON.parse(process.env.DB_LOGGING),
    sync: JSON.parse(process.env.DB_SYNC),
});
//# sourceMappingURL=config.js.map