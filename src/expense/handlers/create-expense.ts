import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { z } from 'zod';

import { ResponseManager } from '@utils/response-manager';
import { ExpenseService } from '../expense-service';
import { Expense } from '../expense-model';
import { handleApiError } from 'src/shared/errors/handle-api-error';

const createExpenseSchema = z.object({
  groupId: z.string().min(1),
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
      return ResponseManager.sendUnauthorizedRequest();
    }

    const parsed = createExpenseSchema.safeParse(
      JSON.parse(event.body || '{}'),
    );

    if (!parsed.success) {
      return ResponseManager.sendBadRequest(
        'Validation error',
        parsed.error.flatten(),
      );
    }

    const {
      groupId,
      description,
      totalAmount,
      currency,
      paidByUserId,
      category,
    } = parsed.data;

    const expense = await ExpenseService.createExpense(
      groupId,
      userId,
      description,
      totalAmount,
      currency,
      paidByUserId,
      category,
    );

    return ResponseManager.sendSuccess<Expense>(
      'Expense created successfully',
      expense,
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
};
