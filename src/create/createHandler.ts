import { APIGatewayProxyHandler, APIGatewayEvent, Context } from 'aws-lambda';
import 'source-map-support/register';
import { HttpsLibrary } from '../utils/https-library';
import { AwsBuildRequest } from '../utils/aws-build-request';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent, _context: Context) => {
  _context.callbackWaitsForEmptyEventLoop = false;

  const body: object = JSON.parse(event.body);
  const baseUrl: string = process.env.MOCK_API_BASEURL;
  const path: string = '/supply-chain';

  let response: any;
  try {
    response = await HttpsLibrary.post(baseUrl, path, body);
  } catch (err) {
    const accountId: string = event.requestContext.accountId;
    await AwsBuildRequest.requestQueue("product-catalog-api-create-queue", { baseUrl, path, body, accountId }, accountId)

    return {
      statusCode: err.response.status,
      body: JSON.stringify({ message: err.message }, null, 2),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Product successfully created.", id: response.data.id }, null, 2),
  };
}
