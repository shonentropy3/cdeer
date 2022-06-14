const { Pool } = require('pg');

const pool = new Pool(
    {
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
        max: 20,
        idleTimeoutMillis: 1000, // close idle clients after 1 second
        connectionTimeoutMillis: 1000,
    }
);

async function get1(table, option) {
    let result = [];
    let { where, limit, order, offset = 0 } = option;
    let sql = '';
    let queryData = [];
    let paramIndex = 0;

    sql += `select * from "${table}" `;

    let whereFields = Object.keys(where || {});
    if (whereFields.length > 0) {
        sql += ' where ';
        for (let field of whereFields) {
            paramIndex++;
            let val = where[field];
            if (Array.isArray(val)) {
                // 应付 in,>,< 之类的
                let [symbol, realVal] = val;

                if (symbol.toLowerCase() === 'in') {
                    let inStr = '';
                    for (let item of realVal) {
                        inStr += `$${paramIndex},`;
                        queryData.push(item);
                        paramIndex++;
                    }
                    inStr = inStr.slice(0, -1);
                    sql += ` "${field}" in (${inStr}) AND `;
                } else {
                    sql += ` "${field}" ${symbol} $${paramIndex} AND `;
                    queryData.push(realVal);
                }
            } else {
                sql += `"${field}" = $${paramIndex} AND `;
                queryData.push(val);
            }
        }
        sql = sql.slice(0, -4); // 去掉最后一个'AND '
    }

    if (Object.keys(order || {}).length > 0) {
        let [field, asc = 'asc'] = order;
        sql += ` order by "${field}" ${asc} `;
    }
    if (limit && limit > 0) {
        sql += ` limit ${limit}`;
    }

    if (offset > 0) {
        sql += ` offset ${offset} `;
    }
    sql += ';';

    let client = await pool.connect();
    try {
        let r = await client.query(sql, queryData);
        if (r && r.rows) result = r.rows;
    } catch (err) {
        console.error('====db====get', { table, option, sql, queryData }, err);
    } finally {
        client.release();
    }
    return result;
}

async function get(sql) {

    let client = await pool.connect();
    let r;
    try {
        r = await client.query(sql);
        if (r && r.rows) result = r.rows;
    } catch (err) {
        console.error('====db====get', { sql }, err);
    } finally {
        client.release();
    }
    return result;
}


async function update1(table, where, upData) {
    let result = 0;
    let queryData = [];
    let paramIndex = 0;

    let sql = `update "${table}" set `;

    for (let key in upData) {
        if (key == 'id') continue;
        paramIndex++;
        let val = upData[key];
        queryData.push(val);
        sql += ` "${key}" = $${paramIndex}, `;
    }
    sql = sql.slice(0, -2); // 去掉最后面的', '

    let whereFields = Object.keys(where);
    if (whereFields.length > 0) {
        sql += ' where ';
        for (let field of whereFields) {
            paramIndex++;
            let val = where[field];
            if (Array.isArray(val)) {
                // 应付 in,>,< 之类的
                let [symbol, realVal] = val;

                if (symbol.toLowerCase() === 'in') {
                    let inStr = '';
                    for (let item of realVal) {
                        inStr += `$${paramIndex},`;
                        queryData.push(item);
                        paramIndex++;
                    }
                    inStr = inStr.slice(0, -1);
                    sql += ` "${field}" in (${inStr}) AND `;
                } else {
                    sql += ` "${field}" ${symbol} $${paramIndex} AND `;
                    queryData.push(realVal);
                }
            } else {
                sql += ` "${field}" = $${paramIndex} AND `;
                queryData.push(val);
            }
        }

        sql = sql.slice(0, -4); //去掉最后面的'and '
    }

    if (queryData.length == 0) {
        console.warn('====db====update lack of parameters');
        return -1;
    }

    let client = await pool.connect();
    try {
        let r = await client.query(sql, queryData);
        if (r && r.rowCount) result = r.rowCount;
    } catch (err) {
        console.error('====db====update', { table, where, upData, sql, queryData }, err);
        result = -1;
    } finally {
        client.release();
    }
    return result;
}

async function update(sql) {

    let client = await pool.connect();
    let r;
    console.log(sql);
    try {
        r = await client.query(sql);
        if (r && r.rows) result = r.rows;
    } catch (err) {
        console.error('====db====get', { sql }, err);
    } finally {
        client.release();
    }
    return result;
}


async function insert1(table, insertObj) {
    let result = 0;
    let queryData = [];

    let sql = `insert into  "${table}" `;

    let vals = [];
    let fields = Object.keys(insertObj);
    if (fields.length == 0) {
        console.warn('====db====insert lack of parameters');
        return -1;
    }

    for (let field of fields) {
        vals.push(insertObj[field]);
    }
    fields = fields.map(ele => `"${ele}"`); //用""包裹，避免与关键字冲突
    let fieldStr = fields.join(',');
    let valStr = '';
    for (let i = 0; i < vals.length; i++) {
        let idx = i + 1;
        valStr += `$${idx},`;
        queryData.push(vals[i]);
    }
    valStr = valStr.slice(0, -1);
    sql += ` (${fieldStr}) `;
    sql += ` values (${valStr}) `;

    let client = await pool.connect();
    try {
        let r = await client.query(sql, queryData);
        if (r && r.rowCount) result = r.rowCount;
    } catch (err) {
        console.error('====db====insert', { table, insertObj, sql, queryData }, err);
        result = -1;
    } finally {
        client.release();
    }
    return result;
}

async function insert(sql, queryData) {
    let result = 0;
    let client = await pool.connect();
    console.log(sql)
    try {
        let r = await client.query(sql, queryData);
        if (r && r.rowCount) result = r.rowCount;
    } catch (err) {
        console.error('====db====insert', { table, insertObj, sql, queryData }, err);
        result = -1;
    } finally {
        client.release();
    }
    return result;
}


async function batchInsert1(table, fields, list) {
    let result = 0;

    for (let item of list) {
        if (item.length !== fields.length) {
            console.warn('====db==== batchInsert invalid parameters', { table, fields, list });
            return -1;
        }
    }

    let queryData = [];

    let sql = `insert into  "${table}" `;


    fields = fields.map(ele => `"${ele}"`); //用""包裹，避免与关键字冲突
    let fieldStr = fields.join(',');
    sql += ` (${fieldStr}) `;
    sql += ' values ';

    let batchValStr = '';
    for (let item of list) {
        let valStr = '';
        item.forEach(ele => {
            if (typeof ele === 'string') {
                valStr += `'${ele}',`;
            } else {
                valStr += `${ele},`;
            }
        });
        valStr = valStr.slice(0, -1);
        batchValStr += ` (${valStr}),`;
    }

    batchValStr = batchValStr.slice(0, -1);
    sql += batchValStr;
    sql += ';';

    let client = await pool.connect();
    try {
        let r = await client.query(sql, queryData);
        if (r && r.rowCount) result = r.rowCount;
    } catch (err) {
        console.error('====db====batch insert', { table, fields, list, sql }, err);
        result = -1;
    } finally {
        client.release();
    }
    return result;
}

async function batchInsert(sql) {
    let result = 0;

    let queryData = [];

    let client = await pool.connect();
    try {
        let r = await client.query(sql);
        if (r && r.rowCount) result = r.rowCount;
    } catch (err) {
        console.error('====db====batch insert', { sql }, err);
        result = -1;
    } finally {
        client.release();
    }
    return result;
}

async function del(table, where) {
    let result = 0;
    let queryData = [];
    let paramIndex = 0;

    let sql = `delete from "${table}"  `;

    let whereFields = Object.keys(where);
    if (whereFields.length > 0) {
        sql += ' where ';
        for (let field of whereFields) {
            paramIndex++;
            let val = where[field];
            sql += ` "${field}" = $${paramIndex} and `;
            queryData.push(val);
        }
        sql = sql.slice(0, -4); //去掉最后面的'and '
    }

    if (queryData.length == 0) {
        console.warn('====db====del lack of parameters');
        return -1;
    }

    let client = await pool.connect();
    try {
        let r = await client.query(sql, queryData);
        if (r && r.rowCount) result = r.rowCount;
    } catch (err) {
        console.error('====db====del', { table, where }, err);
        result = -1;
    } finally {
        client.release();
    }
    return result;
}

module.exports = {
    pool,
    get,
    update,
    insert,
    del,
    batchInsert,
};