import { APIGatewayProxyResult } from 'aws-lambda';

export interface IApiResult {
  ok: boolean;
  message?: string;
  data?: object | any[];
  errors?: any;
}

export class ResponseManager {
  static sendSuccess(
    message: string,
    data?: object | any[],
  ): APIGatewayProxyResult {
    const apiResult: IApiResult = {
      ok: true,
      message,
      data,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(apiResult),
    };
  }

  static sendBadRequest(
    message: string,
    errors?: object | any[],
  ): APIGatewayProxyResult {
    const apiResult: IApiResult = {
      ok: false,
      message,
      errors,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(apiResult),
    };
  }

  static sendInternalServerError(): APIGatewayProxyResult {
    const apiResult: IApiResult = {
      ok: false,
      message: 'Internal server error',
    };

    return {
      statusCode: 200,
      body: JSON.stringify(apiResult),
    };
  }
}
