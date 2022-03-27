import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import _ from 'lodash';
import { Callback, Context } from 'aws-lambda';
import { AppModule } from './app.module';
import { AppService } from './app.service';

let cachedServer: INestApplication;

async function bootstrapServer(): Promise<INestApplication> {
    try {
      if (!cachedServer) {
        const nestApp = await NestFactory.create(AppModule);
  
        await nestApp.listen(process.env.APP_PORT);
  
        cachedServer = nestApp;
      }
  
      return cachedServer;
    } catch (error) {
      console.error(error);
  
      throw error;
    }
  }
export const incomingMessage = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
    try {
        if (event?.source === 'serverless-plugin-warmup') {
          console.info('WarmUp - Lambda is warm!');
          return;
        }
    
        if (!cachedServer) {
          const server = await bootstrapServer();
          cachedServer = server;
        }
    
        console.info('Incoming event', event);
    
        await Promise.all(
          event.Records.map(async record => {
            if (record.Sns && !_.isEmpty(record.Sns)) {
              const eventMessage = JSON.parse(record.Sns.Message);
              const appService = cachedServer.get(AppService);

              await appService.processEvent(eventMessage);
            } else {
              console.error('Empty SNS message', record);
            }
          }),
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
};