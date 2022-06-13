const test = require('./controller/test');

module.exports = [
    ['get', '/test/get', test.testGet],
    ['post', '/test/post', test.testPost],
    ['get', '/test/getProject', test.getProject],
];