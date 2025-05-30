import { APIGatewayProxyResult } from 'aws-lambda';

export interface IApiResult {
  ok: boolean;
  message?: string;
  data?: object | unknown[];
  errors?: unknown;
}

export class ResponseManager {
  static sendSuccess(
    message: string,
    data?: object | unknown[],
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
    errors?: object | unknown[],
  ): APIGatewayProxyResult {
    const apiResult: IApiResult = {
      ok: false,
      message,
      errors,
    };

    return {
      statusCode: 400,
      body: JSON.stringify(apiResult),
    };
  }

  static sendUnauthorizedRequest(
    message: string,
    errors?: object | unknown[],
  ): APIGatewayProxyResult {
    const apiResult: IApiResult = {
      ok: false,
      message,
      errors,
    };

    return {
      statusCode: 401,
      body: JSON.stringify(apiResult),
    };
  }

  static sendInternalServerError(): APIGatewayProxyResult {
    const apiResult: IApiResult = {
      ok: false,
      message: 'Internal server error',
    };

    return {
      statusCode: 500,
      body: JSON.stringify(apiResult),
    };
  }
}
