import { ValueObject, ValueObjectProps } from '@libs/core'

//  generatedAt: 2025-10-18T05:55:49.005Z,
//       size: 5818,
//       mimeType: 'application/pdf'
interface PdfDocumentMetadataProps extends ValueObjectProps {
  generatedAt: Date
  size: number
  mimeType: string
}

interface PdfDocumentArtifactProps extends ValueObjectProps {
  content: Buffer
  filename: string
  location?: string
  meta?: PdfDocumentMetadataProps
}

export class PdfDocumentArtifact extends ValueObject<PdfDocumentArtifactProps> {
  static create(props: {
    content: Buffer
    location?: string
    meta?: PdfDocumentMetadataProps
  }): PdfDocumentArtifact {
    return new PdfDocumentArtifact({
      ...props,
      filename: `document-${Date.now()}.pdf`
    })
  }

  get filename(): string {
    return this.props.filename
  }

  get content(): Buffer {
    return this.props.content
  }

  serialize(): Omit<PdfDocumentArtifactProps, 'content'> {
    return {
      filename: this.props.filename,
      location: this.props.location,
      meta: this.props.meta
        ? {
            generatedAt: this.props.meta.generatedAt,
            size: this.props.meta.size,
            mimeType: this.props.meta.mimeType
          }
        : undefined
    }
  }

  // toPrimitives(): InferPrimitives<PdfDocumentArtifactProps> {
  //   const { content, filename, location, meta } = this.props

  //   const metadata = meta
  //     ? {
  //         generatedAt: meta.generatedAt.toISOString(),
  //         size: meta.size,
  //         mimeType: meta.mimeType,
  //       }
  //     : undefined

  //   return {
  //     content,
  //     filename,
  //     location,
  //     meta: metadata,
  //   } as InferPrimitives<PdfDocumentArtifactProps>
  // }
}
