import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { z } from 'zod';

import { ResponseManager } from '@utils/response-manager';
import { GroupMembershipService } from '../group-membership-service';
import { GroupMembership, GroupRole } from '../group-membership-model';
import { handleApiError } from 'src/shared/errors/handle-api-error';

const createGroupMembershipSchema = z.object({
  groupId: z.string().min(1),
  role: z.nativeEnum(GroupRole),
});

export const createGroupMembership = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.jwt?.claims?.sub;

    if (!userId) {
      return ResponseManager.sendUnauthorizedRequest();
    }

    const parsed = createGroupMembershipSchema.safeParse(
      JSON.parse(event.body || '{}'),
    );

    if (!parsed.success) {
      return ResponseManager.sendBadRequest(
        'Validation error',
        parsed.error.flatten(),
      );
    }

    const { groupId, role } = parsed.data;

    const groupMembership = await GroupMembershipService.createGroupMembership(
      userId,
      groupId,
      role,
    );

    return ResponseManager.sendSuccess<GroupMembership[]>(
      'User group membership created successfully',
      groupMembership,
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
};
