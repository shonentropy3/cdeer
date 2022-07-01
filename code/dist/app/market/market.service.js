"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const posix_1 = require("path/posix");
const rxjs_1 = require("rxjs");
const fs = require('fs');
var upyun = require("upyun");
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({ host: 'localhost', port: '5001', protocol: 'http' });
const service = new upyun.Service('ipfs0', 'upchain', 'upchain123');
const client = new upyun.Client(service);
const { contractAddress, address } = require('../../../deployments/Project.json');
const contractabi = require('../../../deployments/abi/Project.json');
const abi = contractabi.abi;
let MarketService = class MarketService {
    getFile(files) {
        if (files.length === 0) {
            return false;
        }
        return new Promise((resolve, reject) => {
            const file = files[0];
            let time = `${Date.now()}-${file.originalname}`;
            let path = '../../../public' + '/' + time;
            let writeStream = (0, fs_1.createWriteStream)((0, posix_1.join)(__dirname, path));
            writeStream.write(file.buffer, function (err) {
                if (!err) {
                    let res = 'public/' + time;
                    ipfs.add(fs.readFileSync(res), function (err, files) {
                        if (err || typeof files == "undefined") {
                            console.log(err);
                        }
                        else {
                            let obj = {
                                hash: files[0].hash,
                                path: res
                            };
                            resolve(obj);
                        }
                    });
                }
            });
        }).then(res => {
            return res;
        }).catch(() => {
            return false;
        });
    }
    pushFile(file, obj) {
        if (obj === false) {
            return;
        }
        fs.unlink(obj.path, (err) => {
            if (err)
                throw err;
        });
        return obj;
    }
    async createPjc(body) {
        console.log(body);
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
MarketService = __decorate([
    (0, common_1.Injectable)()
], MarketService);
exports.MarketService = MarketService;
//# sourceMappingURL=market.service.js.map