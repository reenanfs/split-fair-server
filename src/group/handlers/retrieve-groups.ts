import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { ResponseManager } from '@utils/response-manager';
import { GroupService } from '../group-service';
import { Group } from '../group-model';

export const retrieveGroups = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.jwt?.claims?.sub;

    if (!userId) {
      return ResponseManager.sendUnauthorizedRequest();
    }
    const groups = await GroupService.getGroupsByUser(userId);

    return ResponseManager.sendSuccess<Group[]>(
      'Groups retrieved successfully',
      groups,
    );
  } catch (error: unknown) {
    console.error(error);
    return ResponseManager.sendInternalServerError();
  }
};
