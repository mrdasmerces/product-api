import { APIGatewayProxyHandler, APIGatewayEvent, Context } from 'aws-lambda';
import 'source-map-support/register';
import { HttpsLibrary } from '../utils/https-library';
import { AwsBuildRequest } from '../utils/aws-build-request';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent, _context: Context) => {
  _context.callbackWaitsForEmptyEventLoop = false;

  const baseUrl: string = process.env.MOCK_API_BASEURL;
  const path: string = `/supply-chain/${event.pathParameters.id}`;

  try {
    await HttpsLibrary.delete(baseUrl, path);
  } catch (err) {
    if (err.response.status !== 404) {
      const accountId: string = event.requestContext.accountId;
      await AwsBuildRequest.requestQueue("product-catalog-api-delete-queue", { baseUrl, path, accountId }, accountId)
    }

    return {
      statusCode: err.response.status,
      body: JSON.stringify({ message: err.message }, null, 2),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Product successfully deleted." }, null, 2),
  };
}
