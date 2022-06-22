const dbUtil = require('../../db/dbUtil');
const db = require('../../db/postgresql');
const result = require('../../com/utils/result');

function _fail(ctx, errmsg, errcode) {
    if (!errmsg) errmsg = '';
    if (!errcode) errcode = -1;

    ctx.response.body = { 'status': errcode, 'message': errmsg };
    return
}

function _succeed(ctx, extraData={}) {
    let base = { 'status': 0, 'message': 'OK' };
    ctx.response.body = Object.assign(base, extraData);
    return;
}

async function testGet(ctx) {
    let succeed = true;
    if (succeed) {
        return _succeed(ctx, { 'foo': 'bar' });
    } else {
        return _fail(ctx, 'something wrong');

        
    }
}

async function getProject(ctx) {
    let records ;
    let sql = `
    SELECT * FROM project;
    `;
    try {
        records = await db.get(sql);
        console.log(records);
        ctx.response.body = Object.assign(records);
    } catch (err) {
        console.log('dbUtil get failed', { sql }, err);
    }
    return;
}

async function testPost(ctx) {
    let queryData = ctx.request.body;

    let succeed = true;
    if (succeed) {
        return _succeed({ 'foo': 'bar' });
    } else {
        return _fail('something wrong');
    }
}


module.exports = {
    testGet,
    testPost,
    getProject,
};