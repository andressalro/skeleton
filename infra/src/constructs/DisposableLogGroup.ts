import * as cdk from 'aws-cdk-lib'
import * as logs from 'aws-cdk-lib/aws-logs'
import { Construct } from 'constructs'

export class DisposableLogGroup extends logs.LogGroup {
  constructor(scope: Construct, name: string) {
    super(scope, name.split('/').pop() ?? name, {
      logGroupName: name,
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })
  }
}
