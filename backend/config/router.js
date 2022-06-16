const upchain = require('../src/controller/getInfo/getAccountInfo');

module.exports = [
    ['get', '/upchain/get', upchain.testGet],
    ['post', '/upchain/post', upchain.testPost],
    ['get', '/upchain/getProject', upchain.getProject],
    // 将项目中角色、项目标签存入数据库
    ['post', '/upchain/insertLabel', upchain.insertLabel],
];