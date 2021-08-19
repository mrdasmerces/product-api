import * as AWS from 'aws-sdk';
AWS.config.region = process.env.AWS_REGION;

export class AwsBuildRequest {

  static async requestQueue(sqsQueueName: string, messageBody: any, accountId: any): Promise<object> {
    const sqs = new AWS.SQS();

    const QueueUrl = `https://sqs.${process.env.AWS_REGION}.amazonaws.com/${accountId}/${sqsQueueName}`;
    
    messageBody = JSON.stringify(messageBody);

    const params = {
      MessageBody: messageBody,
      QueueUrl,
    }

    const sendSQS = sqs.sendMessage(params).promise();
    return sendSQS;
  }
}