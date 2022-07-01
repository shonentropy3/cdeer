import { Body, Controller, Get, HttpCode, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
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


        // return this.usersService.getFile(files)

        return new Promise ((resolve,reject)=>{
            this.usersService.getFile(files)
            resolve(this.usersService.getFile(files))
         })
         .then((res)=>{
            return this.usersService.addFile(files,res)
         })
    }

    @Get('xx')
    xx(){
        return 'xx'
    }

}
