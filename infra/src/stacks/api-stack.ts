import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'

import {
  HttpApi,
  CorsHttpMethod,
  CorsPreflightOptions,
} from 'aws-cdk-lib/aws-apigatewayv2'

export interface ApiStackProps extends StackProps {
  originDomains: string[]
}

export class ApiStack extends Stack {
  public readonly api: HttpApi

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props)

    // HTTP API (v2)
    const corsOptions: CorsPreflightOptions = {
      allowOrigins: props?.originDomains,
      allowMethods: [
        CorsHttpMethod.GET,
        CorsHttpMethod.POST,
        CorsHttpMethod.PUT,
        CorsHttpMethod.DELETE,
        CorsHttpMethod.OPTIONS,
      ],
      allowCredentials: true,
    }

    this.api = new HttpApi(this, 'HttpApiGateway', {
      apiName: 'PdfGeneratorHttpApi',
      description: 'HTTP API Gateway for Pdf Generator',
      corsPreflight: corsOptions,
      createDefaultStage: true,
      disableExecuteApiEndpoint: false,
    })
  }
}
