import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { z } from 'zod';

import { ResponseManager } from '@utils/response-manager';
import { BalanceService } from '../balance-service';
import { Balance } from '../balance-model';
import { handleApiError } from 'src/shared/errors/handle-api-error';

const createBalanceSchema = z.object({
  groupId: z.string().min(1),
  currency: z.string().min(1),
});

export const createPayment = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.jwt?.claims?.sub;

    if (!userId) {
      return ResponseManager.sendUnauthorizedRequest();
    }

    const parsed = createBalanceSchema.safeParse(
      JSON.parse(event.body || '{}'),
    );

    if (!parsed.success) {
      return ResponseManager.sendBadRequest(
        'Validation error',
        parsed.error.flatten(),
      );
    }

    const { groupId, currency } = parsed.data;

    const balance = await BalanceService.createBalance(
      groupId,
      userId,
      currency,
    );

    return ResponseManager.sendSuccess<Balance>(
      'Balance created successfully',
      balance,
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
};
