import * as AWS from 'aws-sdk';
import * as sinon from 'sinon'

import { expect } from 'chai';
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { handler } from '../../get/getHandler';
import axios from 'axios';

process.env.MOCK_API_BASEURL = "https://ev5uwiczj6.execute-api.eu-central-1.amazonaws.com/test";

describe('get product', () => {
  let sandbox: sinon.SinonSandbox = sinon.createSandbox();
  let eventMock: APIGatewayProxyEvent;
  let contextMock: Context;

  beforeEach(() => {
    sandbox.stub(AWS, 'SQS')
      .returns({
        sendMessage: () => ({
          promise: () => { }
        })
      })   

    eventMock = {
      requestContext: { accountId: 123 }
    } as any

    contextMock = {
      callbackWaitsForEmptyEventLoop: true
    } as any
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should get all with success', async () => {
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
        get: () => ({ data: {}})
      } as any)

    const response: any = await handler(eventMock, contextMock, () => { });
    expect(response.statusCode).equal(200);
  });

  it('should get one with success', async () => {
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
        get: () => ({ data: {}})
      } as any)
    eventMock.pathParameters = { id: "1"};

    const response: any = await handler(eventMock, contextMock, () => { });
    expect(response.statusCode).equal(200);
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
      get: () => { throw { response: { status: 500}}}
    } as any)

    const response: any = await handler(eventMock, contextMock, () => { });
    expect(response.statusCode).equal(500);
  });
});