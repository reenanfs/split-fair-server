import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { ResponseManager } from '@utils/response-manager';
import { GroupService } from '../group-service';

export const retrieveGroups = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.jwt?.claims?.sub;

    if (!userId) {
      return ResponseManager.sendUnauthorizedRequest('User not authorized');
    }

    const groups = await GroupService.getGroupsByUser(userId);

    return ResponseManager.sendSuccess('Groups retrieved successfully', groups);
  } catch (error) {
    console.log(error);
    return ResponseManager.sendInternalServerError();
  }
};
