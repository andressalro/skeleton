#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import 'source-map-support/register'
import { ApiStack } from './stacks/api-stack'
import { PdfGenerationStack } from './stacks/PdfGenerationStack'

const app = new cdk.App()

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
  envName: process.env.ENV_NAME || 'dev',
}

// Add common tags for cost traceability
cdk.Tags.of(app).add('Project', 'PdfGenerator')
cdk.Tags.of(app).add('Environment', env.envName)

const apiStack = new ApiStack(app, 'ApiStack', {
  env,
  originDomains: [
    'http://localhost:3000',
    'http://localhost:5173', // vite
    // 'https://frontend.example.com',
  ],
})

new PdfGenerationStack(app, 'PdfGenerationStack', {
  env,
  api: apiStack.api,
})
