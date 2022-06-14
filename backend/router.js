const upchain = require('./controller/getInfo');

module.exports = [
    ['get', '/upchain/get', upchain.testGet],
    ['post', '/upchain/post', upchain.testPost],
    ['get', '/upchain/getProject', upchain.getProject],
];