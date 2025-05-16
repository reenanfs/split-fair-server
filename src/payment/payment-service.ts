import { PutItemCommand, PutItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { dynamoClient } from '@database';
import { Payment } from './payment-model';

const TABLE_NAME = process.env.TABLE_NAME;

export class PaymentService {
  static async createPayment(
    paymentId: string,
    groupId: string,
    fromUserId: string,
    toUserId: string,
    amount: number,
    currency: string,
  ): Promise<PutItemCommandOutput> {
    const timestamp = new Date().toISOString();

    const payment: Payment = {
      pk: `GROUP#${groupId}`,
      sk: `PAYMENT#${paymentId}`,
      payment_id: paymentId,
      group_id: groupId,
      from_user: fromUserId,
      to_user: toUserId,
      amount,
      currency,
      created_at: timestamp,
      updated_at: timestamp,
    };

    return dynamoClient.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall(payment),
      }),
    );
  }
}
