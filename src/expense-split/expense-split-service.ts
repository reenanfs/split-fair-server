import { PutCommandOutput } from '@aws-sdk/lib-dynamodb';

import { dynamoDb } from '@database';
import { ExpenseSplit } from './expense-split-model';
import { requireEnv } from '@utils/require-env';

const TABLE_NAME = requireEnv('TABLE_NAME');

export class ExpenseSplitService {
  static async createExpenseSplit(
    groupId: string,
    expenseId: string,
    userId: string,
    amountOwed: number,
    splitType: string,
    percentage?: number,
  ): Promise<PutCommandOutput> {
    const timestamp = new Date().toISOString();

    const expenseSplit: ExpenseSplit = {
      pk: `GROUP#${groupId}`,
      sk: `EXPENSE#${expenseId}SPLIT#${userId}`,
      entity: 'expense_split',
      group_id: groupId,
      expense_id: expenseId,
      user_id: userId,
      amount_owed: amountOwed,
      split_type: splitType,
      created_at: timestamp,
      updated_at: timestamp,
    };

    if (percentage) {
      expenseSplit.percentage = percentage;
    }

    return dynamoDb.put({
      TableName: TABLE_NAME,
      Item: expenseSplit,
    });
  }
}
