import { PutItemCommand, PutItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { dynamoClient } from '@database';
import { Expense } from './expense-model';

const TABLE_NAME = process.env.TABLE_NAME;

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
  ): Promise<PutItemCommandOutput> {
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

    return dynamoClient.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall(expense),
      }),
    );
  }
}
