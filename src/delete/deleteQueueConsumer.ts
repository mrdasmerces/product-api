import { SQSHandler, SQSEvent, Context } from 'aws-lambda';
import { HttpsLibrary } from '../utils/https-library';
import { AwsBuildRequest } from '../utils/aws-build-request';
import 'source-map-support/register';

export const handler: SQSHandler = async (event: SQSEvent, _context: Context) => {
  _context.callbackWaitsForEmptyEventLoop = false;

  const dataSqs: any = JSON.parse(event.Records[0].body);
  const { baseUrl, path, accountId } = dataSqs;

  try {
    await HttpsLibrary.delete(baseUrl, path);
  } catch (err) { 
    await AwsBuildRequest.requestQueue("product-catalog-api-delete-deadletter-queue", { baseUrl, path }, accountId)
  }
}