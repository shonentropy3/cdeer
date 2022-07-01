import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarketModule } from './app/market/market.module';

@Module({
  imports: [ MarketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
