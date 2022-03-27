import { Injectable } from '@nestjs/common';
import * as aws from 'aws-sdk';

const sns = new aws.SNS({
  endpoint: 'http://127.0.0.1:4561', // port sns local porject
  region: 'ap-southeast-1',
});


@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  /**
   * as subscriber
   */
  processEvent(data: any): void {
    console.log("Incoming Message To Be Process");
    console.log({data})
  }

  /**
   * as publisher
   */
  publishEvent(): void {
    console.log("Publish Event");
    const data = {
      id: 1,
      from: "john",
      subject: 'hello'
    }
    sns.publish(
      {
        Message: JSON.stringify(data),
        TopicArn: 'arn:aws:sns:us-east-1:123456789012:incoming-message' // ArnTopic that we get while running it offline
      }
    ).promise().then(resp => {
      console.log(resp)
      console.log("Success");
    }).catch(err => {
      console.log("ERROR OCCURED");
      console.log(err);
    });
  }
}
