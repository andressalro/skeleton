import { APIGatewayProxyEventV2 } from 'aws-lambda'

import { PdfGenerationFactory } from './GeneratePdfDocumentFactory'
import { GeneratePdfDocumentCommandSchema } from '@contexts/pdf-generation'
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

    const { useCase, pdfDocumentArtifactStore } =
      PdfGenerationFactory.create(tenantId)

    const result = await useCase.execute(command)

    if (!result.artifact) {
      // TODO: refactor error handling in use case to throw Domain error
      throw new Error(
        `PDF generation failed: ${result.toPrimitives().failedReason}`
      )
    }

    // get Public Temp URL from result artifact
    const publicTempUrl = await pdfDocumentArtifactStore.getPublicTempUrl(
      result.artifact,
      60 * 10 // 10 minutes
    )

    return {
      id: result.id.toString(),
      publicTempUrl
    }
  }
)
