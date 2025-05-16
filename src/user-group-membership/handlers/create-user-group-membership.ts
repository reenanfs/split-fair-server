import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { z } from 'zod';

import { ResponseManager } from '@utils/response-manager';
import { UserGroupMembershipService } from '../user-group-membership-service';

const createUserGroupMembershipSchema = z.object({
  userId: z.string().min(1),
  groupId: z.string().min(1),
  role: z.string().min(1),
});

export const createGroup = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');

    const valdiation = createUserGroupMembershipSchema.safeParse(body);

    if (!valdiation.success) {
      return ResponseManager.sendBadRequest(
        'Validation error',
        valdiation.error.flatten(),
      );
    }

    const { userId, groupId, role } = body;

    await UserGroupMembershipService.createUserGroupMembership(
      userId,
      groupId,
      role,
    );

    return ResponseManager.sendSuccess('Group created successfully');
  } catch (error) {
    console.log(error);
    return ResponseManager.sendInternalServerError();
  }
};
