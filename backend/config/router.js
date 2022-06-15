const upchain = require('../src/controller/getInfo/getAccountInfo');

module.exports = [
    ['get', '/upchain/get', upchain.testGet],
    ['post', '/upchain/post', upchain.testPost],
    ['get', '/upchain/getProject', upchain.getProject],
];