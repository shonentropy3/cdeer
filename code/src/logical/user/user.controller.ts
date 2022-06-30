import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createWriteStream } from 'fs';
import { join } from 'path/posix';
import { UserService } from './user.service';
const fs  = require('fs');
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService){}

    @Post('find-one')
    findOne(@Body() body: any) {
        // return this.usersService.findOne(body);
        console.log(this.usersService.findOne(body));
        
        return '执行了';
    }

    @Get('testPort')
    testPort(){
        return this.usersService.testPort()
    }


    @Post('upload')
    @UseInterceptors(FilesInterceptor('files'))
    uploadFile(@UploadedFiles() files){
        
        // return 
        return new Promise((resolve,reject)=>{
            resolve(this.usersService.getFile(files))
        })
         
    }


    @Get('hello')  //  局部路由
    getUserHello(): string {
        return 'UserHello';
    }
}
