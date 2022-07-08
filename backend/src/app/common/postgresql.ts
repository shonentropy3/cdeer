import {Pool} from 'pg'
const pool = new Pool(
    {
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DATABASE,
        password: process.env.POSTGRES_PASSWORD,
        port: Number(process.env.POSTGRES_PORT),
        max: 20,
        idleTimeoutMillis: 1000, // close idle clients after 1 second
        connectionTimeoutMillis: 1000,
    }
);


async function get(sql) {

    let client = await pool.connect();
    let r,result;
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
    let r,result;
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
        console.error('====db====insert', { sql }, err);
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



module.exports = {
    pool,
    get,
    update,
    insert,
    batchInsert,
};