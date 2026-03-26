import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { DomainError } from '@libs/core'
import { ZodError } from 'zod'
import { jsonResponse } from './jsonResponse'

/**
 * Wrapper genérico para lambdas HTTP en AWS.
 * Se encarga de:
 * - Manejar errores comunes (ZodError, DomainError, genéricos)
 * - Loggear excepciones no manejadas
 * - Convertir el resultado a un objeto APIGatewayProxyResultV2
 */
export const lambdaHandler = <
  T extends (event: APIGatewayProxyEventV2) => Promise<unknown>,
>(
  handlerFn: T
): ((event: APIGatewayProxyEventV2) => Promise<APIGatewayProxyResultV2>) => {
  // Registrar listeners globales solo una vez
  if (!process.listeners('uncaughtException').length) {
    process.on('uncaughtException', (err) =>
      console.error('UNCAUGHT EXCEPTION', err)
    )
    process.on('unhandledRejection', (err) =>
      console.error('UNHANDLED REJECTION', err)
    )
  }

  return async (
    event: APIGatewayProxyEventV2
  ): Promise<APIGatewayProxyResultV2> => {
    try {
      const result = await handlerFn(event)

      // Asegura formato consistente
      return jsonResponse(200, result)
    } catch (error) {
      console.error('ERROR CAUGHT BY WRAPPER:', error)

      if (error instanceof ZodError) {
        return jsonResponse(400, {
          message: 'Invalid input',
          errors: error.issues,
        })
      }

      if (error instanceof DomainError) {
        return jsonResponse(400, error.serialize())
      }
      return jsonResponse(500, {
        message: 'Internal Server Error',
        error: (error as Error).message,
        stack: (error as Error).stack,
      })
    }
  }
}
