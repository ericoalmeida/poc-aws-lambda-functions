import * as cdk from 'aws-cdk-lib'
import * as awsApiGateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs'

export interface GatewayApiStackProps extends cdk.StackProps {
  productsFetchHandler: lambda.NodejsFunction
}

export class GatewayApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: GatewayApiStackProps){
    super(scope, id, props);

    const api = new awsApiGateway.RestApi(this, "GatewayAPI", {
      restApiName: "GatewayAPI"
    });

    const productsFetchIntegration = new awsApiGateway.LambdaIntegration(props.productsFetchHandler);
    
    const productsResource = api.root.addResource("products");
    productsResource.addMethod("GET", productsFetchIntegration)
  }
}