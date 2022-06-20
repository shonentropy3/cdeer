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

async function insertLabel(ctx) {
    let queryData = ctx.request.body;
    console.log("queryData=============",queryData);
    queryData = JSON.parse(queryData.proLabel)
    // queryData = queryData.proLabel;
    console.log(queryData);
    if (!queryData || queryData.length == 0) return _fail(ctx,'Failed to insert label',"Parameter error");
    // let sql = `
    // insert into project(sender_adddress,token_id,title,price,pro_content,pro_state,pro_time) VALUES ${insertDatas};
    // `;

    // let sql = `insert into project(token_id,pro_content,recruiting_role,pro_label,pro_type,create_time) 
    // VALUES (167844,'ipfs://QmZbWNKJPAjxXuNFSEaksCJVd1M6DaKQViJBYPK2BdpDEP/','{"ok":1,"ok":2}','{"ok":1,"ok":2}','{"ok":1,"ok":2}',now());
    // `;
    let pro_content = queryData.pro_content;
    let recruiting_role = queryData.recruiting_role;
    let pro_type = queryData.pro_type;
    
    let sql = `insert into project(content,role,pro_type) 
    VALUES ('${pro_content}','${recruiting_role}','${pro_type}');
    `;
    try {
        let num = await db.batchInsert(sql);
        ctx.response.body = Object.assign(num);
    } catch (err) {
        console.log('Failed to insert label', { sql }, err);
        return result.fail(ctx,'Failed to insert label',err);
    }
    return result.succeed(ctx);
}


module.exports = {
    testGet,
    testPost,
    getProject,
    insertLabel,
};