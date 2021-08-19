import * as AWS from 'aws-sdk';
import * as sinon from 'sinon'

import { expect } from 'chai';
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { handler } from '../../create/createHandler';
import axios from 'axios';

process.env.MOCK_API_BASEURL = "https://ev5uwiczj6.execute-api.eu-central-1.amazonaws.com/test";

describe('create product', () => {
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
      body: JSON.stringify({
        name: "product-test",
      }),
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
      post: () => { throw { response: { status: 500}}}
    } as any)

    const response: any = await handler(eventMock, contextMock, () => { });
    expect(response.statusCode).equal(500);
  });
});