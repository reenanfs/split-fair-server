import { PostConfirmationTriggerEvent } from 'aws-lambda';

import { UserService } from '../user-service';

export const createUser = async (
  event: PostConfirmationTriggerEvent,
): Promise<PostConfirmationTriggerEvent> => {
  try {
    const triggerSource = event.triggerSource;

    if (triggerSource !== 'PostConfirmation_ConfirmSignUp') {
      return event;
    }

    const { email, sub: userId } = event.request.userAttributes;

    await UserService.createUser(userId, email);

    return event;
  } catch (error: unknown) {
    console.error(error);
    throw new Error('User replication on ddb failed');
  }
};
