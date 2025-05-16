import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { z } from 'zod';

import { ResponseManager } from '@utils/response-manager';
import { UserService } from '../user-service';

const createUserSchema = z.object({
  name: z.string().min(1),
  phone: z.number().int(),
  email: z.string().email(),
});

export const createUser = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');

    const valdiation = createUserSchema.safeParse(body);

    if (!valdiation.success) {
      return ResponseManager.sendBadRequest(
        'Validation error',
        valdiation.error.flatten(),
      );
    }

    const { name, email, phone } = body;

    await UserService.createUser(name, email, phone);

    return ResponseManager.sendSuccess('User created successfully');
  } catch (error) {
    console.log(error);
    return ResponseManager.sendInternalServerError();
  }
};
