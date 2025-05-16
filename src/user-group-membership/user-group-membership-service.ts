import { PutItemCommand, PutItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { dynamoClient } from '@database';
import { UserGroupMembership } from './user-group-membership-model';

const TABLE_NAME = process.env.TABLE_NAME;

export class UserGroupMembershipService {
  static async createUserGroupMembership(
    userId: string,
    groupId: string,
    role: string,
  ): Promise<PutItemCommandOutput> {
    const timestamp = new Date().toISOString();

    const userGroupMembership: UserGroupMembership = {
      pk: `USER#${userId}`,
      sk: `GROUP#${groupId}`,
      user_id: userId,
      group_id: groupId,
      role: role,
      created_at: timestamp,
      updated_at: timestamp,
    };

    return dynamoClient.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall(userGroupMembership),
      }),
    );
  }
}
