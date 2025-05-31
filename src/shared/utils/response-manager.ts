import { APIGatewayProxyResult } from 'aws-lambda';

export interface ApiResult<T> {
  ok: boolean;
  message?: string;
  data?: T;
}

type ValidationError = {
  fieldErrors: Record<string, string[]>;
  formErrors: string[];
};

export type errorDetails = string[] | ValidationError;

export interface ApiError {
  ok: boolean;
  message?: string;
  errors?: errorDetails;
}

export class ResponseManager {
  static sendSuccess<T>(message: string, data?: T): APIGatewayProxyResult {
    const apiResult: ApiResult<T> = {
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
    errors?: errorDetails,
  ): APIGatewayProxyResult {
    const apiError: ApiError = {
      ok: false,
      message,
      errors,
    };

    return {
      statusCode: 400,
      body: JSON.stringify(apiError),
    };
  }

  static sendUnauthorizedRequest(): APIGatewayProxyResult {
    const apiResult: ApiError = {
      ok: false,
      message: 'Not authorized',
    };

    return {
      statusCode: 401,
      body: JSON.stringify(apiResult),
    };
  }

  static sendNotFoundError(message: string): APIGatewayProxyResult {
    const apiResult: ApiError = {
      ok: false,
      message,
    };

    return {
      statusCode: 404,
      body: JSON.stringify(apiResult),
    };
  }

  static sendInternalServerError(): APIGatewayProxyResult {
    const apiResult: ApiError = {
      ok: false,
      message: 'Internal server error',
    };

    return {
      statusCode: 500,
      body: JSON.stringify(apiResult),
    };
  }
}
