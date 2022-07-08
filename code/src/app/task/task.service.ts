import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
// import insertLog from '../demand/service/insertLogTask'
@Injectable()
export class TaskService {
    private readonly logger = new Logger(TaskService.name);

  // @Cron('45 * * * * *')  // 每隔45秒执行一次
  // handleCron() {
  //   this.logger.debug('Called when the second is 45');
  // }

  @Interval(5000)  //每隔10秒执行一次
  handleInterval() {
    this.logger.debug('Called every 10 seconds');
  }

  init() {
    // global.lock_get_logs = 0;
    console.log('初始化啦');
  }

  @Timeout(5000)  //5秒只执行一次
  handleTimeout() {
    this.init()
    // insertLog()
    
    // this.logger.debug('Called once after 5 seconds');
  }

}
