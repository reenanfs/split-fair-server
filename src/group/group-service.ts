import { v4 as uuidv4 } from 'uuid';

import { dynamoDb } from '@database';
import { Group, GroupDetails } from './group-model';
import {
  GroupMembership,
  GroupRole,
} from 'src/group-membership/group-membership-model';
import { requireEnv } from '@utils/require-env';
import { Balance } from 'src/balance/balance-model';
import { Payment } from 'src/payment/payment-model';
import { Expense } from 'src/expense/expense-model';
import { ExpenseSplit } from 'src/expense-split/expense-split-model';
import { User } from 'src/user/user-model';
import { NotFoundError } from 'src/shared/errors/not-found-error';

const TABLE_NAME = requireEnv('TABLE_NAME');

export class GroupService {
  static async createGroup(name: string, userId: string): Promise<Group> {
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

    const userMembership: GroupMembership = {
      pk: `GROUP#${groupId}`,
      sk: `USER#${userId}`,
      entity: 'group_membership',
      user_id: userId,
      group_id: groupId,
      role: GroupRole.ADMIN,
      created_at: timestamp,
      updated_at: timestamp,
    };

    await dynamoDb.transactWrite({
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
              'attribute_not_exists(PK) AND attribute_not_exists(SK)',
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

    return group;
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

  static async getGroupById(groupId: string): Promise<Group | null> {
    const { Item: group } = await dynamoDb.get({
      TableName: TABLE_NAME,
      Key: {
        pk: `GROUP#${groupId}`,
        sk: 'PROFILE',
      },
    });

    if (!group) {
      return null;
    }

    return group as Group;
  }

  static async getGroupDetails(groupId: string): Promise<GroupDetails> {
    const { Items } = await dynamoDb.query({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': `GROUP#${groupId}`,
      },
    });

    if (!Items || !Items.length) {
      throw new NotFoundError(`Group ${groupId} not found`);
    }

    const group = Items.find((item) => item.sk === 'PROFILE') as Group;

    if (!group) {
      throw new NotFoundError(`Group ${groupId} profile not found`);
    }

    const memberships = Items.filter(
      (item) => item.entity === 'group_membership',
    ) as GroupMembership[];

    const members = await this.getGroupMembers(groupId, memberships);

    const balances = Items.filter(
      (item) => item.entity === 'balance',
    ) as Balance[];

    const payments = Items.filter(
      (item) => item.entity === 'payment',
    ) as Payment[];

    const expenses = Items.filter(
      (item) => item.entity === 'expense',
    ) as Expense[];

    const expenseSplits = Items.filter(
      (item) => item.entity === 'expense_split',
    ) as ExpenseSplit[];

    const expensesWithSplits = expenses.map((expense) => ({
      ...expense,
      splits: expenseSplits.filter(
        (split) => split.expense_id === expense.expense_id,
      ),
    }));

    return {
      group,
      members,
      balances,
      expenses: expensesWithSplits,
      payments,
    };
  }

  static async getGroupMembers(
    groupId: string,
    memberships?: GroupMembership[],
  ): Promise<User[]> {
    let membershipList = memberships;

    if (!membershipList) {
      const { Items } = await dynamoDb.query({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
        ExpressionAttributeValues: {
          ':pk': `GROUP#${groupId}`,
          ':sk': 'USER#',
        },
      });

      membershipList = (Items as GroupMembership[]) ?? [];
    }

    if (!membershipList.length) {
      return [];
    }

    const keys = membershipList.map((membership) => ({
      pk: `USER#${membership.user_id}`,
      sk: 'PROFILE',
    }));

    const batchResponse = await dynamoDb.batchGet({
      RequestItems: {
        [TABLE_NAME]: {
          Keys: keys,
        },
      },
    });

    return (batchResponse.Responses?.[TABLE_NAME] as User[]) ?? [];
  }
}
