import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

export const dynamoClient = DynamoDBDocument.from(
  new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
  }),
  {
    marshallOptions: {
      removeUndefinedValues: true,
      convertClassInstanceToMap: true,
    },
  }
)
