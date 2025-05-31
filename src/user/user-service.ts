import { PutCommandOutput } from '@aws-sdk/lib-dynamodb';

import { dynamoDb } from '@database';
import { User } from './user-model';
import { requireEnv } from '@utils/require-env';

const TABLE_NAME = requireEnv('TABLE_NAME');

export class UserService {
  static async createUser(
    userId: string,
    email: string,
    name?: string,
    phone?: number,
  ): Promise<PutCommandOutput> {
    const timestamp = new Date().toISOString();

    const user: User = {
      pk: `USER#${userId}`,
      sk: `PROFILE`,
      entity: 'user',
      user_id: userId,
      email: email,
      created_at: timestamp,
      updated_at: timestamp,
    };

    if (name) {
      user.name = name;
    }

    if (phone) {
      user.phone = phone;
    }

    return dynamoDb.put({
      TableName: TABLE_NAME,
      Item: user,
    });
  }
}
