import { TransactWriteCommandOutput } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

import { dynamoDb } from '@database';
import { Group } from './group-model';
import {
  GroupMembership,
  GroupRole,
} from 'src/group-membership/group-membership-model';
import { requireEnv } from '@utils/require-env';

const TABLE_NAME = requireEnv('TABLE_NAME');

export class GroupService {
  static async createGroup(
    name: string,
    userId: string,
  ): Promise<TransactWriteCommandOutput> {
    const groupId = uuidv4();
    const timestamp = new Date().toISOString();

    const group: Group = {
      pk: `GROUP#${groupId}`,
      sk: `PROFILE`,
      entity: 'group',
      group_id: groupId,
      name: name,
      created_by: userId,
      created_at: timestamp,
      updated_at: timestamp,
    };

    const groupMembership: GroupMembership = {
      pk: `USER#${userId}`,
      sk: `GROUP#${groupId}`,
      entity: 'group_membership',
      user_id: userId,
      group_id: groupId,
      role: GroupRole.ADMIN,
      created_at: timestamp,
      updated_at: timestamp,
    };

    return dynamoDb.transactWrite({
      TransactItems: [
        {
          Put: {
            TableName: TABLE_NAME,
            Item: group,
            ConditionExpression: 'attribute_not_exists(PK)',
          },
        },
        {
          Put: {
            TableName: TABLE_NAME,
            Item: groupMembership,
            ConditionExpression:
              'attribute_not_exists(PK) AND attribute_not_exists(SK) ',
          },
        },
      ],
    });
  }

  static async getGroupsByUser(userId: string): Promise<Group[]> {
    const queryResponse = await dynamoDb.query({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':sk': 'GROUP#',
      },
      ProjectionExpression: 'group_id',
    });

    const groupIds = queryResponse.Items?.map((item) => item.group_id);

    if (!groupIds?.length) {
      return [];
    }

    const keys = groupIds?.map((groupId) => ({
      pk: `GROUP#${groupId}`,
      sk: 'PROFILE',
    }));

    const batchResponse = await dynamoDb.batchGet({
      RequestItems: {
        [TABLE_NAME]: {
          Keys: keys,
        },
      },
    });

    const groups = batchResponse.Responses?.[TABLE_NAME] ?? [];

    return groups as Group[];
  }
}
