import { PutCommandOutput } from '@aws-sdk/lib-dynamodb';

import { dynamoDb } from '@database';
import { Payment } from './payment-model';
import { requireEnv } from '@utils/require-env';

const TABLE_NAME = requireEnv('TABLE_NAME');

export class PaymentService {
  static async createPayment(
    paymentId: string,
    groupId: string,
    fromUserId: string,
    toUserId: string,
    amount: number,
    currency: string,
  ): Promise<PutCommandOutput> {
    const timestamp = new Date().toISOString();

    const payment: Payment = {
      pk: `GROUP#${groupId}`,
      sk: `PAYMENT#${paymentId}`,
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

    return dynamoDb.put({
      TableName: TABLE_NAME,
      Item: payment,
    });
  }
}
