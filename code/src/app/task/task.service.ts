import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
@Injectable()
export class TaskService {
    private readonly logger = new Logger(TaskService.name);

  @Cron('45 * * * * *')  // 每隔45秒执行一次
  handleCron() {
    this.logger.debug('Called when the second is 45');
  }

  @Interval(10000)  //每隔10秒执行一次
  handleInterval() {
    this.logger.debug('Called every 10 seconds');
  }

  @Timeout(5000)  //5秒只执行一次
  handleTimeout() {
    this.logger.debug('Called once after 5 seconds');
  }

}
