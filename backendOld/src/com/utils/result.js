
function fail(ctx, errmsg, errcode) {
    if (!errmsg) errmsg = '';
    if (!errcode) errcode = -1;

    ctx.response.body = { 'status': errcode, 'message': errmsg };
    return
}

function succeed(ctx, extraData={}) {
    let base = { 'status': 0, 'message': 'OK' };
    ctx.response.body = Object.assign(base, extraData);
    return;
}


module.exports = {
    succeed,
    fail,
};