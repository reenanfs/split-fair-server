import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { ResponseManager } from '@utils/response-manager';
import { GroupService } from '../group-service';
import { GroupDetails } from '../group-model';
import { handleApiError } from 'src/shared/errors/handle-api-error';

export const retrieveGroupDetails = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const groupId = event.pathParameters?.id;

    if (!groupId) {
      return ResponseManager.sendBadRequest('Validation error', [
        'Group id is requires',
      ]);
    }

    const groupDetails = await GroupService.getGroupDetails(groupId);

    return ResponseManager.sendSuccess<GroupDetails>(
      'Group details retrieved successfully',
      groupDetails,
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
};
