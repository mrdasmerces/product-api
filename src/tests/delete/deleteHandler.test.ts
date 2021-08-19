import * as AWS from 'aws-sdk';
import * as sinon from 'sinon'

import { expect } from 'chai';
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { handler } from '../../delete/deleteHandler';
import axios from 'axios';

process.env.MOCK_API_BASEURL = "https://ev5uwiczj6.execute-api.eu-central-1.amazonaws.com/test";

describe('delete product', () => {
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

  it('should delete with success', async () => {
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
        delete: () => ({ data: {}})
      } as any)

    const response: any = await handler(eventMock, contextMock, () => { });
    expect(response.statusCode).equal(200);
  });

  it('should not delete due to 404 error', async () => {
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
      delete: () => { throw { response: { status: 404}}}
    } as any)

    const response: any = await handler(eventMock, contextMock, () => { });
    expect(response.statusCode).equal(404);
  });

  it('should not delete due to an error', async () => {
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
      delete: () => { throw { response: { status: 500}}}
    } as any)

    const response: any = await handler(eventMock, contextMock, () => { });
    expect(response.statusCode).equal(500);
  });
});