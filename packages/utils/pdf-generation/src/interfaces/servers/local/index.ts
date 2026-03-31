import http from 'node:http'
import type { OutgoingHttpHeaders } from 'node:http'
import type { APIGatewayProxyResultV2 } from 'aws-lambda'

import { handler } from '../../functions/lambda'

process.env.PDF_GENERATION_MODE = process.env.PDF_GENERATION_MODE ?? 'local'
process.env.LOCAL_OUTPUT_DIR = process.env.LOCAL_OUTPUT_DIR ?? 'local-output'

const port = Number(process.env.LOCAL_PORT ?? '3100')

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ ok: true, mode: process.env.PDF_GENERATION_MODE }))
    return
  }

  if (req.method !== 'POST' || req.url !== '/pdf-document') {
    res.writeHead(404, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ message: 'Not found' }))
    return
  }

  try {
    const body = await readRequestBody(req)
    const lambdaResult = (await handler({
      version: '2.0',
      routeKey: 'POST /pdf-document',
      rawPath: '/pdf-document',
      rawQueryString: '',
      headers: {
        'x-api-key': req.headers['x-api-key']?.toString() ?? 'local-tenant'
      },
      requestContext: {} as never,
      body,
      isBase64Encoded: false
    } as never)) as APIGatewayProxyResultV2

    if (typeof lambdaResult === 'string') {
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(lambdaResult)
      return
    }

    const headers: OutgoingHttpHeaders = Object.fromEntries(
      Object.entries(
        lambdaResult.headers ?? { 'content-type': 'application/json' }
      ).map(([key, value]) => [key, String(value)])
    )

    res.writeHead(lambdaResult.statusCode ?? 200, headers)
    res.end(lambdaResult.body ?? '')
  } catch (error) {
    res.writeHead(500, { 'content-type': 'application/json' })
    res.end(
      JSON.stringify({
        message: 'Local server error',
        error: error instanceof Error ? error.message : String(error)
      })
    )
  }
})

server.listen(port, () => {
  console.log(`PDF local server listening on http://localhost:${port}`)
  console.log(`Output dir: ${process.env.LOCAL_OUTPUT_DIR}`)
})

function readRequestBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []

    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    })

    req.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf-8'))
    })

    req.on('error', reject)
  })
}
