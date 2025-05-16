import { PutItemCommand, PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import { dynamoClient } from "@database";
import { v4 as uuidv4 } from "uuid";
import { Group } from "./group-model";

const TABLE_NAME = process.env.TABLE_NAME;

export class GroupService {
  static async createGroup(
    name: string,
    userId: string,
  ): Promise<PutItemCommandOutput> {
    const groupId = uuidv4();
    const timestamp = new Date().toISOString();

    const group: Group = {
      pk: `GROUP#${groupId}`,
      sk: `PROFILE`,
      group_id: groupId,
      name: name,
      created_by: userId,
      created_at: timestamp,
      updated_at: timestamp,
    };

    return dynamoClient.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall(group),
      })
    );
  }
}
