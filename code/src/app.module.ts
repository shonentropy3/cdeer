import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarketModule } from './app/market/market.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ 
    MarketModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'test',
      entities: [],
      synchronize: true,
      keepConnectionAlive:true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
