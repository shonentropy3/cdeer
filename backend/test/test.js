const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ 'path': path.join(path.resolve(__dirname, '..'), '.env') });
const db = require('./db');


async function run() {
    let r = await db.getTest();
    console.log(r);
}

run();