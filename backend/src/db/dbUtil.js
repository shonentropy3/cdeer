const db = require('./postgresql');
const logger = require('../com/logger');


async function get() {
    let records = [];
    let sql =`SELECT block FROM block_log WHERE id = 1;`;
    try {
        records = await db.get(sql);
    } catch (err) {
        console.log('dbUtil get failed', { sql }, err);
    }
    return records;
}

async function getLabel(proContent) {
    let records = [];
    let sql =`SELECT recruiting_role,pro_type FROM project_label WHERE pro_content = ${proContent};`;
    try {
        records = await db.get(sql);
    } catch (err) {
        console.log('dbUtil get failed', { sql }, err);
    }
    return records;
}

async function update(table, where, data) {
    let num = 0;
    try {
        num = await db.update(table, where, data);
    } catch (err) {
        console.log('dbUtil update failed', { table, where, data }, err);
    }
}

async function insert(table, data) {
    let num = 0;
    try {
        num = await db.insert(table, data);
    } catch (err) {
        console.log('dbUtil insert failed', { table, data }, err);
    }
    return num;
}

async function batchInsert(table, fields, datas) {
    let num = 0;
    try {
        num = await db.batchInsert(table, fields, datas);
    } catch (err) {
        console.log('dbUtil batchInsert failed', { table, fields, datas }, err);
    }
    return num;
}

async function del(table, where) {
    let num = 0;
    try {
        num = await db.del(table, where);
    } catch (err) {
        console.log('dbUtil del failed', { table, where }, err);
    }
    return num;
}

async function getLastCheckBlock() {
    let settings = await get();
    JSON.stringify(settings);
    if (JSON.stringify(settings).length > 0) return Number(Object. values(settings)[0].block);
    return 0;
}

async function insertPro(insertDatas) {
    if (!insertDatas || insertDatas.length == 0) return 0;
    let sql = `
    insert into project_log(sender_adddress,token_id,title,price,pro_content,pro_state,pro_time) VALUES ${insertDatas};
    `;
    let num = await db.batchInsert(sql);
    console.log(sql)
    return num;
}

async function updateLastCheckBlock(latest) {
    await update(latest);
}

async function update1(table, where, data) {
    let num = 0;
    try {
        num = await db.update1(table, where, data);
    } catch (err) {
        logger.error('dbUtil update failed', { table, where, data }, err);
    }
    return num;
}

async function update(latest) {
    if (!latest) return 0;
    let sql = `
    UPDATE block_log SET block = ${latest} WHERE id = 1;
    `;
    let num = 0;
    try {
        num = await db.update(sql);
    } catch (err) {
        logger.error('dbUtil update failed', { latest }, err);
    }
    return num;
}


module.exports = {
    get,
    update,
    insert,
    batchInsert,
    del,
    getLastCheckBlock,
    insertPro,
    updateLastCheckBlock,
    update,
    getLabel,
};