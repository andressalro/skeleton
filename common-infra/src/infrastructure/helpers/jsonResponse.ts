import { APIGatewayProxyResultV2 } from 'aws-lambda'

// Helper para generar respuestas JSON uniformes
export function jsonResponse(
  statusCode: number,
  body: unknown
): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}
