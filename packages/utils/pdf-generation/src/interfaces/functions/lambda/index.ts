import { APIGatewayProxyEventV2 } from 'aws-lambda'

import { GeneratePdfDocumentControllerFactory } from '../../controllers/generate-pdf-document.controller'
import { GeneratePdfDocumentCommandSchema } from '../../../main'
import { jsonResponse, lambdaHandler } from '@libs/common-infra'

export const handler = lambdaHandler(
  // TODO: enable config options
  // {
  //   apiKeyRequired: true,
  //   schema: GeneratePdfDocumentCommandSchema,
  //   permissionRequired: 'generate:pdf-document'
  // },
  async (event: APIGatewayProxyEventV2) => {
    const tenantId = event.headers['x-api-key']
    if (!tenantId)
      return jsonResponse(401, {
        message: 'Unauthorized'
      })

    const command = GeneratePdfDocumentCommandSchema.parse(
      JSON.parse(event.body || '{}')
    )

    return GeneratePdfDocumentControllerFactory.create(tenantId).execute(
      command
    )
  }
)
