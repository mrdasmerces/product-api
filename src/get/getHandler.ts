import { APIGatewayProxyHandler, APIGatewayEvent, Context } from 'aws-lambda';
import 'source-map-support/register';
import { HttpsLibrary } from '../utils/https-library';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent, _context: Context) => {
  _context.callbackWaitsForEmptyEventLoop = false;

  const baseUrl: string = process.env.MOCK_API_BASEURL;
  let path: string = '/supply-chain';
  if (event.pathParameters && event.pathParameters.id) {
    path += `/${event.pathParameters.id}`
  }

  let response: any;
  try {
    response = await HttpsLibrary.get(baseUrl, path);
  } catch (err) {
    return {
      statusCode: err.response.status,
      body: JSON.stringify({ message: err.message }, null, 2),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response.data, null, 2),
  };
}
