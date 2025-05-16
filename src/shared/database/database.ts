import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const AWS_REGION = process.env.AWS_REGION;

export const dynamoClient = new DynamoDBClient({ region: AWS_REGION });
