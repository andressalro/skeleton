import { EventBridgeClient } from '@aws-sdk/client-eventbridge'

export const eventBridgeClient = new EventBridgeClient({
  region: process.env.AWS_REGION || 'us-east-1',
})
