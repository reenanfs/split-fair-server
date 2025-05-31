import { dynamoDb } from '@database';
import { Balance } from './balance-model';
import { requireEnv } from '@utils/require-env';

const TABLE_NAME = requireEnv('TABLE_NAME');

export class BalanceService {
  static async createBalance(
    groupId: string,
    userId: string,
    currency: string,
  ): Promise<Balance> {
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

    await dynamoDb.put({
      TableName: TABLE_NAME,
      Item: balance,
    });

    return balance;
  }

  static async getBalancesByGroup(groupId: string): Promise<Balance[]> {
    const { Items: balances } = await dynamoDb.query({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': `GROUP#${groupId}`,
        ':sk': 'BALANCE#',
      },
    });

    if (!balances?.length) {
      return [];
    }

    return balances as Balance[];
  }
}
