import { SQSHandler, SQSEvent, Context } from 'aws-lambda';
import { HttpsLibrary } from '../utils/https-library';
import { AwsBuildRequest } from '../utils/aws-build-request';
import 'source-map-support/register';

export const handler: SQSHandler = async (event: SQSEvent, _context: Context) => {
  _context.callbackWaitsForEmptyEventLoop = false;

  const dataSqs: any = JSON.parse(event.Records[0].body);
  const { baseUrl, path, body, accountId, state } = dataSqs;

  if(state === "delete") {
    try {
      const deletePath = path + `${body.id}`
      await HttpsLibrary.delete(baseUrl, deletePath);
    } catch (err) {
      await AwsBuildRequest.requestQueue("product-catalog-api-update-deadletter-queue", { baseUrl, path, body, accountId, state: "delete" }, accountId);
      return;
    }
  }

  try {
    await HttpsLibrary.post(baseUrl, path, body);
  } catch (err) { 
    await AwsBuildRequest.requestQueue("product-catalog-api-update-deadletter-queue", { baseUrl, path, body }, accountId)
  }
}