import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('serverless')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/check-health')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async publishSns(): Promise<void> {
    await this.appService.publishEvent();
    return;
  }
}
