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
exports.CatsController = void 0;
const common_1 = require("@nestjs/common");
const create_cat_dto_1 = require("./create-cat-dto");
let CatsController = class CatsController {
    createCat(createCatDto) {
        return `接受到的createCatDto的数据name:${createCatDto.name}&age:${createCatDto.age}`;
    }
    findAllCats() {
        return '这里是Controller：cats的findAllCats方法～';
    }
    findWildcard() {
        return '这里是路由的通配符(*)';
    }
    findMore(params) {
        return `接受路由中的参数：id：${params.id}，name:${params.name}`;
    }
    findName(name) {
        return `接受特定的参数Name：${name}`;
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cat_dto_1.CreateCatDto]),
    __metadata("design:returntype", String)
], CatsController.prototype, "createCat", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatsController.prototype, "findAllCats", null);
__decorate([
    (0, common_1.Get)('wjy*wjy'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], CatsController.prototype, "findWildcard", null);
__decorate([
    (0, common_1.Get)(':id/:name'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], CatsController.prototype, "findMore", null);
__decorate([
    (0, common_1.Get)(':name'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], CatsController.prototype, "findName", null);
CatsController = __decorate([
    (0, common_1.Controller)('cats')
], CatsController);
exports.CatsController = CatsController;
//# sourceMappingURL=cats.controller.js.map