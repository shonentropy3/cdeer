"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TaskService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const { ethers } = require('ethers');
require("ethers");
const rpcProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const USDR_ADDR = require('../../../deployments/Demand.json');
const BlockLog_1 = require("../../entity/BlockLog");
const Project_1 = require("../../entity/Project");
const dbutils_1 = require("../db/dbutils");
let TaskService = TaskService_1 = class TaskService {
    constructor(projectRepository, blockLogRepository) {
        this.projectRepository = projectRepository;
        this.blockLogRepository = blockLogRepository;
        this.logger = new common_1.Logger(TaskService_1.name);
        this._insertLog = async () => {
            let latest = await rpcProvider.getBlockNumber();
            let last = await this.blockLogRepository.query((0, dbutils_1.last_check_block)());
            console.log(last);
            let logBlock = last[0].block;
            if (logBlock >= latest)
                return;
            logBlock = Math.max(logBlock, (latest - 100));
            let fromBlock = logBlock + 1;
            let toBlock = latest;
            let filter = {
                address: USDR_ADDR.address,
                topics: [
                    ethers.utils.id("CreateDemand(uint256,address,string,uint256,string,string,uint256)")
                ],
                fromBlock,
                toBlock
            };
            const logs = await rpcProvider.getLogs(filter);
            const CreateDemand = new ethers.utils.Interface(["event CreateDemand(uint256 indexed demandId, address indexed demandAddr, string title, uint256 budget, string desc, string attachment, uint256 )"]);
            if (logs.length > 0) {
                let txs = logs.map((ele) => {
                    let decodedData = CreateDemand.parseLog(ele);
                    return {
                        demandId: decodedData.args[0].toString(),
                        demandAddr: decodedData.args[1],
                        title: decodedData.args[2],
                        budget: decodedData.args[3].toString(),
                        desc: decodedData.args[4],
                        attachment: decodedData.args[5],
                        period: decodedData.args[6].toString(),
                    };
                });
                let value = ``;
                for (const v of txs) {
                    value += `
            ('${v.demandAddr}',${v.demandId},'${v.title}',${v.budget},'${v.desc}'),
            `;
                }
                console.log(value);
                let params = value.substring(0, (value.lastIndexOf(',')));
                let sql = `UPDATE project 
        SET user_address = temp.user_address, pro_id = temp.demandId, title = temp.title, budget = temp.budget, update_time = now()
        from (values ${params}) as temp (user_address, demandId,title, budget,content) where project.content=temp.content;
        `;
                console.log(sql);
                try {
                    let result = await this.projectRepository.query(sql);
                    console.log(result[1]);
                    if (-1 != result[1]) {
                        await this.blockLogRepository.query(`UPDATE block_log SET block = ${latest} WHERE id = 0;`);
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
            else {
                console.log(logs.length);
            }
        };
    }
    handleInterval() {
    }
    init() {
        console.log('初始化啦');
    }
    handleTimeout() {
        this.init();
        this._insertLog();
    }
};
__decorate([
    (0, schedule_1.Interval)(3000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskService.prototype, "handleInterval", null);
__decorate([
    (0, schedule_1.Timeout)(20),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskService.prototype, "handleTimeout", null);
TaskService = TaskService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Project_1.Project)),
    __param(1, (0, typeorm_1.InjectRepository)(BlockLog_1.BlockLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TaskService);
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map