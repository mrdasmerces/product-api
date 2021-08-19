import * as AWS from 'aws-sdk';
import * as sinon from 'sinon'

import { SQSEvent, Context } from 'aws-lambda';
import { handler } from '../../create/createQueueConsumer';
import axios from 'axios';

process.env.MOCK_API_BASEURL = "https://ev5uwiczj6.execute-api.eu-central-1.amazonaws.com/test";

describe('create product queue consumer', () => {
  let sandbox: sinon.SinonSandbox = sinon.createSandbox();
  let eventMock: SQSEvent;
  let contextMock: Context;

  beforeEach(() => {
    sandbox.stub(AWS, 'SQS')
      .returns({
        sendMessage: () => ({
          promise: () => { }
        })
      })   

    eventMock = {
      Records: [
        {
          body: JSON.stringify({
            accountId: 1,
            baseUrl: process.env.MOCK_API_BASEURL,
            path: '/test',
            body: {}
          })
        }
      ],
      requestContext: { accountId: 123 }
    } as any

    contextMock = {
      callbackWaitsForEmptyEventLoop: true
    } as any
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should create with success', async () => {
    sandbox.stub(axios, 'create')
      .returns({
        interceptors: {
          request: {
            use: () => {} 
          },
          response: {
            use: () => {} 
          }
        },
        post: () => ({ data: {}})
      } as any)

    await handler(eventMock, contextMock, () => { });
  });

  it('should not create due to an error', async () => {
    sandbox.stub(axios, 'create')
    .returns({
      interceptors: {
        request: {
          use: () => {} 
        },
        response: {
          use: () => {} 
        }
      },
      post: () => { throw { response: { status: 500}}}
    } as any)

    await handler(eventMock, contextMock, () => { });
  });
});