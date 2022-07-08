import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarketModule } from './app/market/market.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { TaskModule } from './app/task/task.module';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from './config';



@Module({
  imports: [ 
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get('POSTGRES_HOST'),
          port: config.get('POSTGRES_PORT'),
          database: config.get('POSTGRES_DATABASE'),
          username: config.get('POSTGRES_USER'),
          password: config.get('POSTGRES_PASSWORD'),
          entities: [],
          synchronize: true,
          keepConnectionAlive:true
        };
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    
    MarketModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
