import { PutItemCommand, PutItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { dynamoClient } from '@database';
import { Payment } from './balance-model';

const TABLE_NAME = process.env.TABLE_NAME;

export class BalanceService {
  static async createBalance(
    groupId: string,
    userId: string,
    currency: string,
  ): Promise<PutItemCommandOutput> {
    const timestamp = new Date().toISOString();

    const payment: Payment = {
      pk: `GROUP#${groupId}`,
      sk: `BALANCE#${userId}`,
      entity: 'balance',
      group_id: groupId,
      user_id: userId,
      currency,
      balance_map: {},
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
