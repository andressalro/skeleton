import { z } from 'zod'

export const GeneratePdfDocumentCommandSchema = z.object({
  template: z.string().min(1, 'template is required'),
  data: z.object({
    header: z.record(z.string(), z.unknown()),
    pages: z
      .array(z.record(z.string(), z.unknown()))
      .min(1, 'pages cannot be empty'),
  }),
})

// Infer type from schema
export type GeneratePdfDocumentCommand = z.infer<
  typeof GeneratePdfDocumentCommandSchema
>
