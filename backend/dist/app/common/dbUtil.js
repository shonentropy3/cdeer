"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbutils = void 0;
const db = require('./postgresql');
const logger = require('./logger');
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const BlockLog_1 = require("../demand/entity/BlockLog");
let dbutils = class dbutils {
    constructor(blockLogRepository) {
        this.blockLogRepository = blockLogRepository;
    }
    async get() {
        let records = [];
        let sql = `SELECT block FROM block_log WHERE id = 1;`;
        try {
            records = await this.blockLogRepository.query(sql);
        }
        catch (err) {
            console.log('dbUtil get failed', { sql }, err);
        }
        return records;
    }
    async getLabel(proContent) {
        let records = [];
        let sql = `SELECT role,pro_type FROM project WHERE desc = '${proContent}';`;
        try {
            records = await this.blockLogRepository.query(sql);
        }
        catch (err) {
            console.log('dbUtil get failed', { sql }, err);
        }
        return records;
    }
    async insert(table, keys, values) {
        let sql = `INSERT INTO public.${table}(${keys}) VALUES (${values});`;
        try {
            let num = await this.blockLogRepository.query(sql);
        }
        catch (err) {
            console.log('dbUtil insert failed', { sql }, err);
        }
        return;
    }
};
dbutils = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(BlockLog_1.BlockLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], dbutils);
exports.dbutils = dbutils;
async function _get() {
    let records = [];
    let sql = `SELECT block FROM block_log WHERE id = 1;`;
    try {
        records = await this.blockLogRepository.query(sql);
    }
    catch (err) {
        console.log('dbUtil get failed', { sql }, err);
    }
    return records;
}
exports.default = _get;
async function batchInsert(table, fields, datas) {
    let num = 0;
    try {
        num = await db.batchInsert(table, fields, datas);
    }
    catch (err) {
        console.log('dbUtil batchInsert failed', { table, fields, datas }, err);
    }
    return num;
}
async function del(table, where) {
    let num = 0;
    try {
        num = await db.del(table, where);
    }
    catch (err) {
        console.log('dbUtil del failed', { table, where }, err);
    }
    return num;
}
async function insertPro(insertDatas) {
    if (!insertDatas || insertDatas.length == 0)
        return 0;
    let end = insertDatas.lastIndexOf(',');
    let value = insertDatas.substr(0, end);
    console.log("value", value);
    let sql = `
    UPDATE project SET user_address = temp.user_address,token_id = temp.token_id,title = temp.title,budget = temp.budget,update_time = now()
    from (values ${value}) as temp (user_address,token_id,title,budget,desc) where project.desc=temp.requirements; 
    `;
    console.log(sql);
    let num = await db.batchInsert(sql);
    console.log(sql);
    return num;
}
async function updateLastCheckBlock(latest) {
    await update(latest);
}
async function update(latest) {
    if (!latest)
        return 0;
    let sql = `
    UPDATE block_log SET block = ${latest} WHERE id = 1;
    `;
    let num = 0;
    try {
        num = await db.update(sql);
    }
    catch (err) {
        logger.error('dbUtil update failed', { latest }, err);
    }
    return num;
}
module.exports = {
    batchInsert,
    del,
    insertPro,
    updateLastCheckBlock,
    update,
};
//# sourceMappingURL=dbUtil.js.map