const upchain = require('../src/controller/getInfo/getAccountInfo');
const test = require('../src/controller/storage/storage')
module.exports = [
    ['get', '/upchain/get', upchain.testGet],
    ['post', '/upchain/post', upchain.testPost],
    ['get', '/upchain/getProject', upchain.getProject],
    // 发布项目
    // ['post', '/upchain/createProject', upchain.createProject],
    // ['post', '/upchain/apply', upchain.apply],
    // 接收附件
    ['post', '/upchain/storage', test.storage],

];