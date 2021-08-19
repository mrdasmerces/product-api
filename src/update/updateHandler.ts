import { APIGatewayProxyHandler, APIGatewayEvent, Context } from 'aws-lambda';
import 'source-map-support/register';
import { HttpsLibrary } from '../utils/https-library';
import { AwsBuildRequest } from '../utils/aws-build-request';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent, _context: Context) => {
  _context.callbackWaitsForEmptyEventLoop = false;

  const body: any = JSON.parse(event.body);
  const baseUrl: string = process.env.MOCK_API_BASEURL;
  const path: string = '/supply-chain';

  try {
    const getPath = path + `/${event.pathParameters.id}`
    await HttpsLibrary.get(baseUrl, getPath);
  } catch (err) {
    return {
      statusCode: err.response.status,
      body: JSON.stringify({ message: err.message }, null, 2),
    };
  }

  try {
    const deletePath = path + `/${event.pathParameters.id}`
    await HttpsLibrary.delete(baseUrl, deletePath);
  } catch (err) {
    const accountId: string = event.requestContext.accountId;
    await AwsBuildRequest.requestQueue("product-catalog-api-update-queue", { baseUrl, path, body, accountId, state: "delete" }, accountId)

    return {
      statusCode: err.response.status,
      body: JSON.stringify({ message: err.message }, null, 2),
    };
  }

  try {
    body.id = event.pathParameters.id;
    await HttpsLibrary.post(baseUrl, path, body);
  } catch (err) {
    const accountId: string = event.requestContext.accountId;
    await AwsBuildRequest.requestQueue("product-catalog-api-update-queue", { baseUrl, path, body, accountId, state: "create", }, accountId)

    return {
      statusCode: err.response.status,
      body: JSON.stringify({ message: err.message }, null, 2),
    };
  }



  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Product successfully updated." }, null, 2),
  };
}
