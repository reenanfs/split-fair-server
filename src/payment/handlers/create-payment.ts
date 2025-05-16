import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { z } from 'zod';

import { ResponseManager } from '@utils/response-manager';
import { PaymentService } from '../payment-service';

const createPaymentSchema = z.object({
  paymentId: z.string().min(1),
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
    const body = JSON.parse(event.body || '{}');

    const valdiation = createPaymentSchema.safeParse(body);

    if (!valdiation.success) {
      return ResponseManager.sendBadRequest(
        'Validation error',
        valdiation.error.flatten(),
      );
    }

    const { paymentId, groupId, fromUserId, toUserId, amount, currency } = body;

    await PaymentService.createPayment(
      paymentId,
      groupId,
      fromUserId,
      toUserId,
      amount,
      currency,
    );

    return ResponseManager.sendSuccess('Payment created successfully');
  } catch (error) {
    console.log(error);
    return ResponseManager.sendInternalServerError();
  }
};
