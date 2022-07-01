import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { UserService } from './logical/user/user.service';
// import { UserController } from './logical/user/user.controller';
// import { UserModule } from './logical/user/user.module';
import { UserModule } from './logical/user/user.module'
import { MarketModule } from './app/market/market.module';

@Module({
  imports: [UserModule, MarketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
