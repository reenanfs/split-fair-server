import { PutCommandOutput } from '@aws-sdk/lib-dynamodb';

import { dynamoDb } from '@database';
import { Expense } from './expense-model';
import { requireEnv } from '@utils/require-env';

const TABLE_NAME = requireEnv('TABLE_NAME');

export class ExpenseService {
  static async createExpense(
    groupId: string,
    expenseId: string,
    userId: string,
    description: string,
    totalAmount: number,
    currency: string,
    paidByUserId: string,
    category?: string,
  ): Promise<PutCommandOutput> {
    const timestamp = new Date().toISOString();

    const expense: Expense = {
      pk: `GROUP#${groupId}`,
      sk: `EXPENSE#${expenseId}`,
      entity: 'expense',
      group_id: groupId,
      expense_id: expenseId,
      description,
      total_amount: totalAmount,
      currency,
      created_by: userId,
      paid_by: paidByUserId,
      created_at: timestamp,
      updated_at: timestamp,
    };

    if (category) {
      expense.category = category;
    }

    return dynamoDb.put({
      TableName: TABLE_NAME,
      Item: expense,
    });
  }
}
