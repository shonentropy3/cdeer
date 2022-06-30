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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const fs_1 = require("fs");
const posix_1 = require("path/posix");
const fs = require('fs');
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({ host: 'localhost', port: '5001', protocol: 'http' });
let UserService = class UserService {
    constructor(http) {
        this.http = http;
    }
    findOne(body) {
        console.log(body);
        return body;
    }
    testPort() {
        return this.http
            .get(`http://127.0.0.1:3000/codemarket/app`)
            .pipe((0, operators_1.tap)((res) => (`Status: ${res.status}`)), (0, operators_1.map)((res) => res.data));
    }
    getFile(files) {
        let hash = 'chu';
        new Promise((resolve, reject) => {
            const file = files[0];
            let time = `${Date.now()}-${file.originalname}`;
            let path = '../../../public' + '/' + time;
            let writeStream = (0, fs_1.createWriteStream)((0, posix_1.join)(__dirname, path));
            writeStream.write(file.buffer, function (err) {
                if (!err) {
                    resolve(time);
                }
            });
        })
            .then((time) => {
            let res = '/Users/xiaonahe/Desktop/work/code-market/code-market/public/' + time;
            ipfs.add(fs.readFileSync(res), function (err, files) {
                if (err || typeof files == "undefined") {
                    console.log(err);
                }
                else {
                    console.log(files[0].hash);
                    return (files[0].hash);
                    (0, posix_1.resolve)(hash = files[0].hash);
                }
            });
        })
            .then(res => {
            console.log('3==>', hash);
            return 'xx';
        });
    }
    add(time) {
        return new Promise((resolve, reject) => {
            try {
                let res = '/Users/xiaonahe/Desktop/work/code-market/code-market/public/' + time;
                ipfs.add(fs.readFileSync(res), function (err, files) {
                    if (err || typeof files == "undefined") {
                        reject(err);
                    }
                    else {
                        console.log(files[0].hash);
                        resolve(files[0].hash);
                    }
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    }
    handleError(error) {
        if (error.response) {
            if (error.response.status === common_1.HttpStatus.NOT_FOUND) {
                return (0, rxjs_1.throwError)(new common_1.NotFoundException(error.response.data));
            }
            else if (error.response.status === common_1.HttpStatus.BAD_REQUEST) {
                return (0, rxjs_1.throwError)(new common_1.BadRequestException(error.response.data));
            }
            else {
                return (0, rxjs_1.throwError)(new common_1.HttpException(error.response.data, error.response.status));
            }
        }
        else {
            return (0, rxjs_1.throwError)(error.message);
        }
    }
};
__decorate([
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserService.prototype, "findOne", null);
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map