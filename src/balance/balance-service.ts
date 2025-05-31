import { PutCommandOutput } from '@aws-sdk/lib-dynamodb';

import { dynamoDb } from '@database';
import { Balance } from './balance-model';
import { requireEnv } from '@utils/require-env';

const TABLE_NAME = requireEnv('TABLE_NAME');

export class BalanceService {
  static async createBalance(
    groupId: string,
    userId: string,
    currency: string,
  ): Promise<PutCommandOutput> {
    const timestamp = new Date().toISOString();

    const balance: Balance = {
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

    return dynamoDb.put({
      TableName: TABLE_NAME,
      Item: balance,
    });
  }
}
