import { v4 as uuidv4 } from 'uuid';

import { dynamoDb } from '@database';
import { Expense } from './expense-model';
import { requireEnv } from '@utils/require-env';

const TABLE_NAME = requireEnv('TABLE_NAME');

export class ExpenseService {
  static async createExpense(
    groupId: string,
    userId: string,
    description: string,
    totalAmount: number,
    currency: string,
    paidByUserId: string,
    category?: string,
  ): Promise<Expense> {
    const expenseId = uuidv4();
    const timestamp = new Date().toISOString();

    const expense: Expense = {
      pk: `GROUP#${groupId}`,
      sk: `EXPENSE#${timestamp}#${expenseId}`,
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

    await dynamoDb.put({
      TableName: TABLE_NAME,
      Item: expense,
    });

    return expense;
  }
}
