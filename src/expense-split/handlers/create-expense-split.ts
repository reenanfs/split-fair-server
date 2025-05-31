import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { z } from 'zod';

import { ResponseManager } from '@utils/response-manager';
import { ExpenseSplitService } from '../expense-split-service';
import { ExpenseSplit } from '../expense-split-model';
import { handleApiError } from 'src/shared/errors/handle-api-error';

const createExpenseSplitSchema = z.object({
  groupId: z.string().min(1),
  expenseId: z.string().min(1),
  amountOwed: z.number().nonnegative(),
  splitType: z.string().min(1),
  percentage: z.number().min(0).max(1),
});

export const createExpenseSplit = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.jwt?.claims?.sub;

    if (!userId) {
      return ResponseManager.sendUnauthorizedRequest();
    }

    const parsed = createExpenseSplitSchema.safeParse(
      JSON.parse(event.body || '{}'),
    );

    if (!parsed.success) {
      return ResponseManager.sendBadRequest(
        'Validation error',
        parsed.error.flatten(),
      );
    }

    const { groupId, expenseId, amountOwed, splitType, percentage } =
      parsed.data;

    const expenseSplit = await ExpenseSplitService.createExpenseSplit(
      groupId,
      expenseId,
      userId,
      amountOwed,
      splitType,
      percentage,
    );

    return ResponseManager.sendSuccess<ExpenseSplit>(
      'Expense split created successfully',
      expenseSplit,
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
};
