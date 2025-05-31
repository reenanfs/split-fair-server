import { v4 as uuidv4 } from 'uuid';

import { dynamoDb } from '@database';
import { Payment } from './payment-model';
import { requireEnv } from '@utils/require-env';

const TABLE_NAME = requireEnv('TABLE_NAME');

export class PaymentService {
  static async createPayment(
    groupId: string,
    fromUserId: string,
    toUserId: string,
    amount: number,
    currency: string,
  ): Promise<Payment> {
    const paymentId = uuidv4();
    const timestamp = new Date().toISOString();

    const payment: Payment = {
      pk: `GROUP#${groupId}`,
      sk: `PAYMENT#${timestamp}#${paymentId}`,
      entity: 'payment',
      payment_id: paymentId,
      group_id: groupId,
      from_user: fromUserId,
      to_user: toUserId,
      amount,
      currency,
      created_at: timestamp,
      updated_at: timestamp,
    };

    await dynamoDb.put({
      TableName: TABLE_NAME,
      Item: payment,
    });

    return payment;
  }
}
