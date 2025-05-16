import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { z } from 'zod';

import { ResponseManager } from '@utils/response-manager';
import { BalanceService } from '../balance-service';

const createPaymentSchema = z.object({
  groupId: z.string().min(1),
  userId: z.string().min(1),
  currency: z.string().min(1),
});

export const createPayment = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');

    const valdiation = createPaymentSchema.safeParse(body);

    if (!valdiation.success) {
      return ResponseManager.sendBadRequest(
        'Validation error',
        valdiation.error.flatten(),
      );
    }

    const { groupId, userId, currency } = body;

    await BalanceService.createBalance(groupId, userId, currency);

    return ResponseManager.sendSuccess('Balance created successfully');
  } catch (error) {
    console.log(error);
    return ResponseManager.sendInternalServerError();
  }
};
