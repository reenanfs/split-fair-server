import {
  PutItemCommand,
  PutItemCommandOutput,
  TransactWriteItemsCommand,
  TransactWriteItemsCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { dynamoClient } from '@database';
import { v4 as uuidv4 } from 'uuid';
import { Group } from './group-model';

import {
  GroupMembership,
  GroupRole,
} from 'src/group-membership/group-membership-model';

const TABLE_NAME = process.env.TABLE_NAME;

export class GroupService {
  static async createGroup(
    name: string,
    userId: string,
  ): Promise<TransactWriteItemsCommandOutput> {
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

    return dynamoClient.send(
      new TransactWriteItemsCommand({
        TransactItems: [
          {
            Put: {
              TableName: TABLE_NAME,
              Item: marshall(group),
              ConditionExpression: 'attribute_not_exists(PK)',
            },
          },
          {
            Put: {
              TableName: TABLE_NAME,
              Item: marshall(groupMembership),
              ConditionExpression:
                'attribute_not_exists(PK) AND attribute_not_exists(SK) ',
            },
          },
        ],
      }),
    );
  }

  static async getGroupsByUser(userId: string): Promise<PutItemCommandOutput> {
    return dynamoClient.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall({ userId }),
      }),
    );
  }
}
