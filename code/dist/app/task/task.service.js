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
const rpcProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const USDR_ADDR = require('../../../deployments/Demand.json');
const BlockLog_1 = require("../../entity/BlockLog");
let TaskService = TaskService_1 = class TaskService {
    constructor(blockLogRepository) {
        this.blockLogRepository = blockLogRepository;
        this.logger = new common_1.Logger(TaskService_1.name);
        this._insertLog = async () => {
            let latest = await rpcProvider.getBlockNumber();
            let last_check_block = await this.blockLogRepository.query(`SELECT block FROM block_log WHERE id = 0;`);
            if (last_check_block >= latest)
                return;
            last_check_block = Math.max(last_check_block, (latest - 100));
            let fromBlock = last_check_block + 1;
            let toBlock = latest;
            let filter = {
                address: USDR_ADDR.address,
                topics: [
                    ethers.utils.id("CreateProject(address,uint256,string,uint256,string,uint256)")
                ],
                fromBlock,
                toBlock
            };
            let logs = await rpcProvider.getLogs(filter);
            const CreatProjectEvent = new ethers.utils.Interface(["event CreateProject(address indexed user, uint256 indexed tokenId, string title, uint256 budget, string desc, uint256 period)"]);
            if (logs.length > 0) {
                let txs = logs.map(ele => {
                    let decodedData = CreatProjectEvent.parseLog(ele);
                    return {
                        msgSenderAdddress: decodedData.args.msgSenderAdddress,
                        tokenId: decodedData.args.tokenId,
                        title: decodedData.args.title,
                        budget: decodedData.args.budget,
                        desc: decodedData.args.desc,
                        period: decodedData.args.period,
                    };
                });
                let value = ``;
                for (const v of txs) {
                    value += `
            ('${v.msgSenderAdddress}',${v.tokenId},'${v.title}',${v.budget},'${v.desc}'),
            `;
                }
                let params = value.substring(0, (value.length - 1));
                let result = await this.blockLogRepository.query(`
        UPDATE project 
        SET user_address = temp.user_address,
        token_id = temp.token_id,
        title = temp.title,
        budget = temp.budget,
        update_time = now()
        from (values ${params}) as temp (user_address,token_id,title,budget,desc) where project.desc=temp.requirements; 
        `);
                if (-1 != result) {
                    await this.blockLogRepository.query(`UPDATE block_log SET block = ${latest} WHERE id = 1;`);
                }
            }
            else {
                console.log(logs.length);
            }
        };
    }
    handleInterval() {
        this._insertLog();
    }
    init() {
        console.log('初始化啦');
    }
    handleTimeout() {
        this.init();
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
    __param(0, (0, typeorm_1.InjectRepository)(BlockLog_1.BlockLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TaskService);
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map