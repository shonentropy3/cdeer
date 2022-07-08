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