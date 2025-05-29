import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { z } from 'zod';

import { ResponseManager } from '@utils/response-manager';
import { ExpenseService } from '../expense-service';

const createExpenseSchema = z.object({
  groupId: z.string().min(1),
  expenseId: z.string().min(1),
  description: z.string().min(1),
  totalAmount: z.number().nonnegative(),
  currency: z.string().min(1),
  paidByUserId: z.string().min(1),
  category: z.string().optional(),
});

export const createExpense = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.jwt?.claims?.sub;

    if (!userId) {
      return ResponseManager.sendUnauthorizedRequest('User not authorized');
    }

    const body = JSON.parse(event.body || '{}');

    const valdiation = createExpenseSchema.safeParse(body);

    if (!valdiation.success) {
      return ResponseManager.sendBadRequest(
        'Validation error',
        valdiation.error.flatten(),
      );
    }

    const {
      groupId,
      expenseId,
      description,
      totalAmount,
      currency,
      paidByUserId,
      category,
    } = body;

    await ExpenseService.createExpense(
      groupId,
      expenseId,
      userId,
      description,
      totalAmount,
      currency,
      paidByUserId,
      category,
    );

    return ResponseManager.sendSuccess('Expense created successfully');
  } catch (error) {
    console.log(error);
    return ResponseManager.sendInternalServerError();
  }
};
