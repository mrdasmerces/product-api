import * as AWS from 'aws-sdk';
import * as sinon from 'sinon'

import { expect } from 'chai';
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { handler } from '../../update/updateHandler';
import axios from 'axios';

process.env.MOCK_API_BASEURL = "https://ev5uwiczj6.execute-api.eu-central-1.amazonaws.com/test";

describe('update product', () => {
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
      pathParameters: { id: 1},
      requestContext: { accountId: 123 }
    } as any

    contextMock = {
      callbackWaitsForEmptyEventLoop: true
    } as any
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should update with success', async () => {
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
        post: () => ({ data: {}}),
        get: () => ({ data: {}}),
        delete: () => ({ data: {}})
      } as any)

    const response: any = await handler(eventMock, contextMock, () => { });
    expect(response.statusCode).equal(200);
  });

  it('should not create due to an error on get', async () => {
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

  it('should not create due to an error on delete', async () => {
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
      get: () => ({ data: {}}),
      delete: () => { throw { response: { status: 500}}}
    } as any)

    const response: any = await handler(eventMock, contextMock, () => { });
    expect(response.statusCode).equal(500);
  });

  it('should not create due to an error on update', async () => {
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
      get: () => ({ data: {}}),
      delete: () => ({ data: {}}),
      post: () => { throw { response: { status: 500}}}
    } as any)

    const response: any = await handler(eventMock, contextMock, () => { });
    expect(response.statusCode).equal(500);
  });
});