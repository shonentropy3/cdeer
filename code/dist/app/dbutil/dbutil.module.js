"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbutilModule = void 0;
const common_1 = require("@nestjs/common");
const dbutil_service_1 = require("./dbutil.service");
const Project_1 = require("../../entity/Project");
const BlockLog_1 = require("../../entity/BlockLog");
const typeorm_1 = require("@nestjs/typeorm");
let DbutilModule = class DbutilModule {
};
DbutilModule = __decorate([
    (0, common_1.Module)({
        providers: [dbutil_service_1.DbutilService],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([Project_1.Project, BlockLog_1.BlockLog])
        ]
    })
], DbutilModule);
exports.DbutilModule = DbutilModule;
//# sourceMappingURL=dbutil.module.js.map