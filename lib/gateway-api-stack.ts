import * as cdk from 'aws-cdk-lib'
import * as awsApiGateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs'

export interface GatewayApiStackProps extends cdk.StackProps {
  productsFetchHandler: lambda.NodejsFunction,
  productsAdminHandler: lambda.NodejsFunction
}

export class GatewayApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: GatewayApiStackProps){
    super(scope, id, props);

    const logGroup = new LogGroup(this, "GatewayAPILogs");
    const api = new awsApiGateway.RestApi(this, "GatewayAPI", {
      restApiName: "GatewayAPI",
      cloudWatchRole: true,
      deployOptions: {
        accessLogDestination: new awsApiGateway.LogGroupLogDestination(logGroup),
        accessLogFormat:awsApiGateway.AccessLogFormat.jsonWithStandardFields({
          httpMethod: true,
          ip: true,
          protocol: true,
          requestTime: true,
          resourcePath: true,
          responseLength: true,
          status: true,
          caller: true,
          user: true
        })
      }
    });

    const productsAdminIntegration = new awsApiGateway.LambdaIntegration(props.productsAdminHandler);
    const productsFetchIntegration = new awsApiGateway.LambdaIntegration(props.productsFetchHandler);
    
    const productsRootResource = api.root.addResource("products");
    const productIdResource = productsRootResource.addResource("{id}");
    
    productsRootResource.addMethod("GET", productsFetchIntegration);
    productsRootResource.addMethod("POST", productsAdminIntegration);
    productIdResource.addMethod("GET", productsFetchIntegration);
    productIdResource.addMethod("PUT", productsAdminIntegration);
    productIdResource.addMethod("DELETE", productsAdminIntegration);
  }
}