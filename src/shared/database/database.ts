import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

import { requireEnv } from '@utils/require-env';

const AWS_REGION = requireEnv('AWS_REGION');

const dynamoClient = new DynamoDBClient({ region: AWS_REGION });
export const dynamoDb = DynamoDBDocument.from(dynamoClient);
