import { Body, Controller, Get, Header, HttpCode, Param, Post } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { CreateCatDto } from './create-cat-dto';

@Controller('cats')
export class CatsController {
  // @Post()
  // @HttpCode(200)
  // @Header('Cache-Control', 'defineHeader')
  // createPost() {
  //   return '这里是Controller：POST路由的cats的createPost方法～';
  // }

  @Post()
  @HttpCode(200)
  createCat(@Body() createCatDto: CreateCatDto): string {
    return `接受到的createCatDto的数据name:${createCatDto.name}&age:${createCatDto.age}`;

  }

  @Get()
  findAllCats() {
    return '这里是Controller：cats的findAllCats方法～';
  }

  // 异步Promise路由

  // @Get()
  // async findAllCats(): Promise<any[]> {
  //   return ['async', 'Promise'];
  // }

  // Rxjs observable 流路由
//   @Get()
//   findAllCats(): Observable<any[]> {
//     return of(['Rxjs', 'observable', '流路由']);
//   }

  @Get('wjy*wjy')
  findWildcard(): string {
    return '这里是路由的通配符(*)';
  }

  // @Get(':id')
  // findOne(@Param() params) {
  //   return `接受路由中的参数：${params.id}`;
  // }

  @Get(':id/:name')
  findMore(@Param() params): string {
    return `接受路由中的参数：id：${params.id}，name:${params.name}`;
  }

  @Get(':name')
  findName(@Param('name') name): string {
    return `接受特定的参数Name：${name}`;
  }
}

