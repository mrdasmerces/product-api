import axios from 'axios';
const axiosRetry = require('axios-retry');
export class HttpsLibrary {

  static isRetryableErrorDefault(error: any) {
    return error.code === 'ECONNABORTED' || (!error.response || error.response.status >= 500 && error.response.status <= 599);
  }

  static async post(baseUrl: string, path: string, body: object, headers: object = {}, timeout: number = 3000, retries: number = 2, isRetryableError: any = HttpsLibrary.isRetryableErrorDefault): Promise<object> {
    const options = {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'User-Agent': process.env.AWS_LAMBDA_FUNCTION_NAME
      },
      baseUrl,
      timeout,
    };

    const client = axios.create(options);
    axiosRetry(client, {
      retries,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: isRetryableError,
      shouldResetTimeout: true
    });

    return await client.post(`${baseUrl}${path}`, body);
  }

  static async get(baseUrl: string, path: string, headers: object = {}, timeout: number = 3000, retries: number = 2, isRetryableError: any = HttpsLibrary.isRetryableErrorDefault): Promise<object> {
    const options = {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'User-Agent': process.env.AWS_LAMBDA_FUNCTION_NAME
      },
      baseUrl,
      timeout,
    };

    const client = axios.create(options);
    axiosRetry(client, {
      retries,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: isRetryableError,
      shouldResetTimeout: true
    });

    return await client.get(`${baseUrl}${path}`);
  }

  static async delete(baseUrl: string, path: string, headers: object = {}, timeout: number = 3000, retries: number = 2, isRetryableError: any = HttpsLibrary.isRetryableErrorDefault): Promise<object> {
    const options = {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'User-Agent': process.env.AWS_LAMBDA_FUNCTION_NAME
      },
      baseUrl,
      timeout,
    };

    const client = axios.create(options);
    axiosRetry(client, {
      retries,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: isRetryableError,
      shouldResetTimeout: true
    });

    return await client.delete(`${baseUrl}${path}`);
  }
}