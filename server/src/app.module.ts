import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DemandModule } from './app/module/demand';
// 配置文件
import configuration from './config';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    DemandModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
