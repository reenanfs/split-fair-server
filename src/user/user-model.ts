import { AttributeValue, PutItemCommand } from "@aws-sdk/client-dynamodb";

export interface User {
  pk: string;
  sk: string;
  user_id: string;
  name: string;
  email: string;
  phone?: number;
  profile_picture_url?: string;
  created_at: string;
  updated_at: string;
}
