import { PutCommandOutput } from '@aws-sdk/lib-dynamodb';

import { dynamoDb } from '@database';
import { GroupMembership, GroupRole } from './group-membership-model';
import { requireEnv } from '@utils/require-env';

const TABLE_NAME = requireEnv('TABLE_NAME');

export class GroupMembershipService {
  static async createGroupMembership(
    userId: string,
    groupId: string,
    role: GroupRole,
  ): Promise<PutCommandOutput> {
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

    return dynamoDb.put({
      TableName: TABLE_NAME,
      Item: groupMembership,
    });
  }
}
