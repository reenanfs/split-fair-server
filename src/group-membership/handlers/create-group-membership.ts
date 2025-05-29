import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { z } from 'zod';

import { ResponseManager } from '@utils/response-manager';
import { GroupMembershipService } from '../group-membership-service';

const createGroupMembershipSchema = z.object({
  groupId: z.string().min(1),
  role: z.string().min(1),
});

export const createGroupMembership = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.jwt?.claims?.sub;

    if (!userId) {
      return ResponseManager.sendUnauthorizedRequest('User not authorized');
    }

    const body = JSON.parse(event.body || '{}');

    const valdiation = createGroupMembershipSchema.safeParse(body);

    if (!valdiation.success) {
      return ResponseManager.sendBadRequest(
        'Validation error',
        valdiation.error.flatten(),
      );
    }

    const { groupId, role } = body;

    await GroupMembershipService.createGroupMembership(userId, groupId, role);

    return ResponseManager.sendSuccess(
      'User group membership created successfully',
    );
  } catch (error) {
    console.log(error);
    return ResponseManager.sendInternalServerError();
  }
};
