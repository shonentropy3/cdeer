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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const market_service_1 = require("./market.service");
let MarketController = class MarketController {
    constructor(marketService) {
        this.marketService = marketService;
    }
    async uploadFile(files) {
        return await new Promise((resolve, reject) => {
            resolve(this.marketService.getFile(files));
        })
            .then((res) => {
            return this.marketService.pushFile(files, res);
        });
    }
    async createProject(body) {
        return await this.marketService.createDemand(body);
    }
    async getMarketData() {
        return await this.marketService.getMarketData();
    }
    async projectDetail(body) {
        return await this.marketService.getProjectDetail(body);
    }
    createCat(body) {
        return `接受到的createCatDto的数据name:${body.name}&age:${body.age}`;
    }
};
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('publish'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "createProject", null);
__decorate([
    (0, common_1.Get)('getMarketData'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "getMarketData", null);
__decorate([
    (0, common_1.Post)('projectDetail'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "projectDetail", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], MarketController.prototype, "createCat", null);
MarketController = __decorate([
    (0, common_1.Controller)('market'),
    __metadata("design:paramtypes", [market_service_1.MarketService])
], MarketController);
exports.MarketController = MarketController;
//# sourceMappingURL=market.controller.js.map