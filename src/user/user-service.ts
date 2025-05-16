import { PutItemCommand, PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import { dynamoClient } from "@database";
import { v4 as uuidv4 } from "uuid";
import { User } from "./user-model";

const TABLE_NAME = process.env.TABLE_NAME;

export class UserService {
  static async createUser(
    name: string,
    email: string,
    phone?: number,
    profile_picture_url?: string
  ): Promise<PutItemCommandOutput> {
    const userId = uuidv4();
    const timestamp = new Date().toISOString();

    const user: User = {
      pk: `USER#${userId}`,
      sk: `PROFILE`,
      user_id: userId,
      name: name,
      email: email,
      created_at: timestamp,
      updated_at: timestamp,
    };

    if (phone) {
      user.phone = phone;
    }

    if (profile_picture_url) {
      user.profile_picture_url = profile_picture_url;
    }

    return dynamoClient.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall(user),
      })
    );
  }
}
