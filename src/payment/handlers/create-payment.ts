import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { z } from 'zod';

import { ResponseManager } from '@utils/response-manager';
import { PaymentService } from '../payment-service';
import { Payment } from '../payment-model';
import { handleApiError } from 'src/shared/errors/handle-api-error';

const createPaymentSchema = z.object({
  groupId: z.string().min(1),
  fromUserId: z.string().min(1),
  toUserId: z.string().min(1),
  amount: z.number().nonnegative(),
  currency: z.string().min(1),
});

export const createPayment = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const parsed = createPaymentSchema.safeParse(
      JSON.parse(event.body || '{}'),
    );

    if (!parsed.success) {
      return ResponseManager.sendBadRequest(
        'Validation error',
        parsed.error.flatten(),
      );
    }

    const { groupId, fromUserId, toUserId, amount, currency } = parsed.data;

    const payment = await PaymentService.createPayment(
      groupId,
      fromUserId,
      toUserId,
      amount,
      currency,
    );

    return ResponseManager.sendSuccess<Payment>(
      'Payment created successfully',
      payment,
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
};
