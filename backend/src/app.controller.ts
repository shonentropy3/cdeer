import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')   //  所有局部路由的前缀|避免重复
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()  //  局部路由
  getHello(): string {
    // return this.appService.getHello();
    return 'test' 
  }
}
