import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { z } from 'zod';

import { ResponseManager } from '@utils/response-manager';
import { ExpenseSplitService } from '../expense-split-service';

const createExpenseSplitSchema = z.object({
  groupId: z.string().min(1),
  expenseId: z.string().min(1),
  userId: z.string().min(1),
  amountOwed: z.number().nonnegative(),
  splitType: z.string().min(1),
  percentage: z.number().min(0).max(1),
});

export const createExpenseSplit = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');

    const valdiation = createExpenseSplitSchema.safeParse(body);

    if (!valdiation.success) {
      return ResponseManager.sendBadRequest(
        'Validation error',
        valdiation.error.flatten(),
      );
    }

    const { groupId, expenseId, userId, amountOwed, splitType, percentage } =
      body;

    await ExpenseSplitService.createExpenseSplit(
      groupId,
      expenseId,
      userId,
      amountOwed,
      splitType,
      percentage,
    );

    return ResponseManager.sendSuccess('Expense split created successfully');
  } catch (error) {
    console.log(error);
    return ResponseManager.sendInternalServerError();
  }
};
