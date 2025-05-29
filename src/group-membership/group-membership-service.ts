import { PutItemCommand, PutItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { dynamoClient } from '@database';
import { GroupMembership, GroupRole } from './group-membership-model';

const TABLE_NAME = process.env.TABLE_NAME;

export class GroupMembershipService {
  static async createGroupMembership(
    userId: string,
    groupId: string,
    role: GroupRole,
  ): Promise<PutItemCommandOutput> {
    const timestamp = new Date().toISOString();

    const groupMembership: GroupMembership = {
      pk: `USER#${userId}`,
      sk: `GROUP#${groupId}`,
      entity: 'group_membership',
      user_id: userId,
      group_id: groupId,
      role: role,
      created_at: timestamp,
      updated_at: timestamp,
    };

    return dynamoClient.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall(groupMembership),
      }),
    );
  }
}
