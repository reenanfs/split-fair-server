import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { z } from 'zod';

import { ResponseManager } from '@utils/response-manager';
import { GroupService } from '../group-service';

const createGroupSchema = z.object({
  name: z.string().min(1),
});

export const createGroup = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.jwt?.claims?.sub;

    if (!userId) {
      return ResponseManager.sendUnauthorizedRequest('User not authorized');
    }

    const body = JSON.parse(event.body || '{}');

    const valdiation = createGroupSchema.safeParse(body);

    if (!valdiation.success) {
      return ResponseManager.sendBadRequest(
        'Validation error',
        valdiation.error.flatten(),
      );
    }

    const { name } = body;

    await GroupService.createGroup(name, userId);

    return ResponseManager.sendSuccess('Group created successfully');
  } catch (error) {
    console.log(error);
    return ResponseManager.sendInternalServerError();
  }
};
