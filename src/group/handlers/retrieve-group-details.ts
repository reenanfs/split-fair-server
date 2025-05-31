import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { z } from 'zod';

import { ResponseManager } from '@utils/response-manager';
import { GroupService } from '../group-service';
import { GroupDetails } from '../group-model';
import { handleApiError } from 'src/shared/errors/handle-api-error';

const retrieveGroupDetailsSchema = z.object({
  groupId: z.string().min(1),
});

export const retrieveGroupDetails = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const parsed = retrieveGroupDetailsSchema.safeParse(
      JSON.parse(event.body || '{}'),
    );

    if (!parsed.success) {
      return ResponseManager.sendBadRequest(
        'Validation error',
        parsed.error.flatten(),
      );
    }

    const { groupId } = parsed.data;

    const groupDetails = await GroupService.getGroupDetails(groupId);

    return ResponseManager.sendSuccess<GroupDetails>(
      'Group details retrieved successfully',
      groupDetails,
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
};
