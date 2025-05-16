import { PutItemCommand, PutItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { dynamoClient } from '@database';
import { ExpenseSplit } from './expense-split-model';

const TABLE_NAME = process.env.TABLE_NAME;

export class ExpenseSplitService {
  static async createExpenseSplit(
    groupId: string,
    expenseId: string,
    userId: string,
    amountOwed: number,
    splitType: string,
    percentage?: number,
  ): Promise<PutItemCommandOutput> {
    const timestamp = new Date().toISOString();

    const expenseSplit: ExpenseSplit = {
      pk: `GROUP#${groupId}`,
      sk: `EXPENSE#${expenseId}SPLIT#${userId}`,
      group_id: `GROUP#${groupId}`,
      expense_id: `EXPENSE#${expenseId}`,
      user_id: `USER#${userId}`,
      amount_owed: amountOwed,
      split_type: splitType,
      created_at: timestamp,
      updated_at: timestamp,
    };

    if (percentage) {
      expenseSplit.percentage = percentage;
    }

    return dynamoClient.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall(expenseSplit),
      }),
    );
  }
}
