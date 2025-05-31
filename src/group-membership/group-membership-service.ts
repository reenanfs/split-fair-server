import { dynamoDb } from '@database';
import { GroupMembership, GroupRole } from './group-membership-model';
import { requireEnv } from '@utils/require-env';

const TABLE_NAME = requireEnv('TABLE_NAME');

export class GroupMembershipService {
  static async createGroupMembership(
    userId: string,
    groupId: string,
    role: GroupRole,
  ): Promise<GroupMembership[]> {
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

    const userMembership: GroupMembership = {
      pk: `GROUP#${groupId}`,
      sk: `USER#${userId}`,
      entity: 'group_membership',
      user_id: userId,
      group_id: groupId,
      role: role,
      created_at: timestamp,
      updated_at: timestamp,
    };

    await dynamoDb.transactWrite({
      TransactItems: [
        {
          Put: {
            TableName: TABLE_NAME,
            Item: groupMembership,
            ConditionExpression: 'attribute_not_exists(PK)',
          },
        },
        {
          Put: {
            TableName: TABLE_NAME,
            Item: userMembership,
            ConditionExpression:
              'attribute_not_exists(PK) AND attribute_not_exists(SK) ',
          },
        },
      ],
    });

    return [groupMembership, userMembership];
  }
}
