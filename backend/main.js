const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ 'path': path.join(path.resolve(__dirname, '.'), '.env') });
const logger = require('./logger');
const cronJob = require('./cronJob');
const app = require('./koa');


process.on('uncaughtException', (err, origin) => {
    logger.error(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

function run() {
    // 启动http
    app.listen(process.env.PORT);
    logger.info(`App listening on ${process.env.PORT}`);

    // 定时任务
    cronJob();
}

run();
