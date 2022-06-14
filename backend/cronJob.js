const job = require('./job');


function init() {
    global.lock_get_logs = 0;
}

function run() {
    init();
    setInterval(job.insertLog, 3 * 1000); // 监听创建项目日志
    // setInterval(job.test, 3 * 1000);
}

module.exports = run;