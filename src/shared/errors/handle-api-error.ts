import { APIGatewayProxyResult } from 'aws-lambda';
import { NotFoundError } from './not-found-error';
import { ResponseManager } from '@utils/response-manager';

export const handleApiError = (error: unknown): APIGatewayProxyResult => {
  console.error(error);

  if (error instanceof NotFoundError) {
    return ResponseManager.sendNotFoundError(error.message);
  }
  return ResponseManager.sendInternalServerError();
};
