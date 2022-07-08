import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const { ethers } = require('ethers');
// let PROVIDER_URL:any;
// const config:ConfigService ;

//     PROVIDER_URL = config.get('PROVIDER_URL');

// console.log(PROVIDER_URL);


let rpcProvider = new ethers.providers.JsonRpcProvider("giraffe negative bird riot glare wild clarify rate fox deny omit mouse");



