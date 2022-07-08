"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../common/provider");
require("../../common/dbUtil");
require("hardhat");
const USDR_ADDR = require('../../../../deployments/Demand.json');
async function insertLog() {
    if (global.lock_get_logs)
        return;
    global.lock_get_logs = 1;
    global.lock_get_logs = 0;
}
exports.default = insertLog;
//# sourceMappingURL=insertLogTask.js.map