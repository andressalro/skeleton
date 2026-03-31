import { z } from 'zod'

const GeneratePdfInlineTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  body: z.string().min(1, 'template.body is required'),
  header: z.string().default('<div></div>'),
  footer: z.string().default('<div></div>'),
  engine: z.enum(['handlebars', 'ejs']).default('ejs'),
  printConfig: z
    .object({
      top: z.string().optional(),
      bottom: z.string().optional(),
      left: z.string().optional(),
      right: z.string().optional(),
      format: z.string().optional(),
      landscape: z.boolean().optional(),
      printBackground: z.boolean().optional(),
      displayHeaderFooter: z.boolean().optional(),
      preferCSSPageSize: z.boolean().optional()
    })
    .optional()
})

export const GeneratePdfDocumentCommandSchema = z.object({
  template: z.union([
    z.string().min(1, 'template is required'),
    GeneratePdfInlineTemplateSchema
  ]),
  data: z.record(z.string(), z.unknown())
})

// Infer type from schema
export type GeneratePdfDocumentCommand = z.infer<
  typeof GeneratePdfDocumentCommandSchema
>
