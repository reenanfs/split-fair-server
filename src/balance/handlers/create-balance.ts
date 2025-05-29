import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { z } from 'zod';

import { ResponseManager } from '@utils/response-manager';
import { BalanceService } from '../balance-service';

const createPaymentSchema = z.object({
  groupId: z.string().min(1),
  currency: z.string().min(1),
});

export const createPayment = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.jwt?.claims?.sub;

    if (!userId) {
      return ResponseManager.sendUnauthorizedRequest('User not authorized');
    }

    const body = JSON.parse(event.body || '{}');

    const valdiation = createPaymentSchema.safeParse(body);

    if (!valdiation.success) {
      return ResponseManager.sendBadRequest(
        'Validation error',
        valdiation.error.flatten(),
      );
    }

    const { groupId, currency } = body;

    await BalanceService.createBalance(groupId, userId, currency);

    return ResponseManager.sendSuccess('Balance created successfully');
  } catch (error) {
    console.log(error);
    return ResponseManager.sendInternalServerError();
  }
};
