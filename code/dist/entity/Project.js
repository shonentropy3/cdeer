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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const typeorm_1 = require("typeorm");
let Project = class Project {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "integer", name: "id" }),
    __metadata("design:type", Number)
], Project.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("character", { name: "user_address", nullable: true, length: 22 }),
    __metadata("design:type", String)
], Project.prototype, "userAddress", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { name: "demand_id", nullable: true, unique: true }),
    __metadata("design:type", String)
], Project.prototype, "demandId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "title", length: 256 }),
    __metadata("design:type", String)
], Project.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "budget", precision: 18, scale: 8 }),
    __metadata("design:type", String)
], Project.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { name: "period", nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "period", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "role", nullable: true, array: true }),
    __metadata("design:type", Array)
], Project.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "pro_type", nullable: true, array: true }),
    __metadata("design:type", Array)
], Project.prototype, "proType", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "content", length: 32 }),
    __metadata("design:type", String)
], Project.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "attachment", length: 32 }),
    __metadata("design:type", String)
], Project.prototype, "attachment", void 0);
__decorate([
    (0, typeorm_1.Column)("smallint", { name: "status", default: () => "1" }),
    __metadata("design:type", Number)
], Project.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("date", {
        name: "create_time",
        nullable: true,
        default: () => "now()",
    }),
    __metadata("design:type", String)
], Project.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.Column)("date", {
        name: "update_time",
        nullable: true,
        default: () => "now()",
    }),
    __metadata("design:type", String)
], Project.prototype, "updateTime", void 0);
Project = __decorate([
    (0, typeorm_1.Index)("project_demand_id_key", ["demandId"], { unique: true }),
    (0, typeorm_1.Index)("project_pkey", ["id"], { unique: true }),
    (0, typeorm_1.Index)("user_address", ["userAddress"], {}),
    (0, typeorm_1.Entity)("project", { schema: "public" })
], Project);
exports.Project = Project;
//# sourceMappingURL=Project.js.map