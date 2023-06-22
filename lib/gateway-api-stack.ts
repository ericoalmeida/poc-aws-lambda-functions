import * as cdk from 'aws-cdk-lib'
import * as awsApiGateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs'

export class GatewayApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope, id, props);

    const apiGateway = new awsApiGateway.RestApi(this, "GatewayAPI", {
      restApiName: "GatewayAPI"
    })
  }
}