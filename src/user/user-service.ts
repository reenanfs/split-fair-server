import { PutItemCommand, PutItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { dynamoClient } from '@database';
import { User } from './user-model';

const TABLE_NAME = process.env.TABLE_NAME;

export class UserService {
  static async createUser(
    userId: string,
    email: string,
    name?: string,
    phone?: number,
  ): Promise<PutItemCommandOutput> {
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

    return dynamoClient.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall(user),
      }),
    );
  }
}
