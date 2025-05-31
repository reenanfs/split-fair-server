import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const AWS_REGION = process.env.AWS_REGION;

const dynamoClient = new DynamoDBClient({ region: AWS_REGION });
export const dynamoDb = DynamoDBDocument.from(dynamoClient);
