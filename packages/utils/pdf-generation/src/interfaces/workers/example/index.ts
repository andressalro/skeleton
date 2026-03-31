import { GeneratePdfDocumentCommandSchema } from '../../../main'

export async function runWorkerExample(payload: unknown) {
  const command = GeneratePdfDocumentCommandSchema.parse(payload)

  console.info(
    'Example worker bootstrap loaded. This adapter is intentionally non-functional.',
    {
      templateType: typeof command.template
    }
  )

  throw new Error(
    'Worker example is only a structural bootstrap. Provide queue/event integration to make it functional.'
  )
}

if (require.main === module) {
  runWorkerExample({
    template: {
      body: '<html><body><h1><%= employee.name %></h1></body></html>'
    },
    data: {
      employee: {
        name: 'Worker Example'
      }
    }
  }).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
