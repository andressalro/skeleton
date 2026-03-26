import * as cdk from 'aws-cdk-lib'
import { HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2'
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb'
import { EventBus } from 'aws-cdk-lib/aws-events'
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { BlockPublicAccess, Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3'
import { Construct } from 'constructs'
import path from 'path'
import { DisposableLogGroup } from '../constructs/DisposableLogGroup'

export interface PdfGenerationStackProps extends cdk.StackProps {
  api: HttpApi
}

export class PdfGenerationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PdfGenerationStackProps) {
    super(scope, id, props)

    const moduleName = 'PdfGeneration'

    const documentsBucket = new Bucket(this, 'DocumentsBucket', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })

    const documentsTable = new Table(this, 'DocumentsTable', {
      partitionKey: { name: 'PK', type: AttributeType.STRING },
      sortKey: { name: 'SK', type: AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      billingMode: BillingMode.PAY_PER_REQUEST,
    })

    const eventBus = EventBus.fromEventBusName(
      this,
      'PdfGenerationEventBus',
      'default'
    )

    const pdfGenerationFunction = new NodejsFunction(
      this,
      'PdfGenerationFunction',
      {
        runtime: Runtime.NODEJS_22_X,
        architecture: Architecture.ARM_64,
        memorySize: 1024,
        timeout: cdk.Duration.minutes(15),
        handler: 'handler',
        entry: path.join(
          __dirname,
          '../../../packages/reports/apps/pdf-generation/src/index.ts'
        ),
        environment: {
          DOCUMENTS_BUCKET_NAME: documentsBucket.bucketName,
          BASE_FOLDER_NAME: 'generated-pdf-documents',
          DYNAMO_PDF_TABLE_NAME: documentsTable.tableName,
          DYNAMO_TEMPLATE_TABLE_NAME: documentsTable.tableName,
          EVENT_BUS_NAME: eventBus.eventBusName,
          EVENT_SOURCE: 'aps.utils.pdf-generation',
        },
        logGroup: new DisposableLogGroup(
          this,
          `/aws/lambda/${moduleName}PdfGenerationFunction`
        ),
      }
    )

    documentsBucket.grantReadWrite(pdfGenerationFunction)
    documentsTable.grantReadWriteData(pdfGenerationFunction)
    eventBus.grantPutEventsTo(pdfGenerationFunction)

    props.api.addRoutes({
      methods: [HttpMethod.POST],
      path: '/pdf-document',
      integration: new HttpLambdaIntegration(
        'PdfGenerationFunction',
        pdfGenerationFunction
      ),
    })
  }
}
