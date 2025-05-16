import { PutItemCommand, PutItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { dynamoClient } from '@database';
import { Expense } from './expense-model';

const TABLE_NAME = process.env.TABLE_NAME;

export class ExpenseService {
  static async createExpense(
    groupId: string,
    userId: string,
    expenseId: string,
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
      group_id: `GROUP#${groupId}`,
      expense_id: `EXPENSE#${expenseId}`,
      description,
      total_amount: totalAmount,
      currency,
      created_by: `USER#${userId}`,
      paid_by: `USER#${paidByUserId}`,
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
