const dbUtil = require('../dbUtil');


async function getTest() {
    let option = {
        'where': {
            'id': ['in', [3, 2]],
        }
    };
    let users = await dbUtil.get('users', option);
    return users;
}

module.exports = {
    getTest,
};