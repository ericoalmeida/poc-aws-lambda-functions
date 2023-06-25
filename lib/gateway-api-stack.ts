import * as cdk from "aws-cdk-lib";
import * as awsApiGateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

export interface GatewayApiStackProps extends cdk.StackProps {
  findAllProductsHandler: lambda.NodejsFunction;
  findProductByIDHandler: lambda.NodejsFunction;
  createProductHandler: lambda.NodejsFunction;
}

export class GatewayApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: GatewayApiStackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, "GatewayAPILogs");
    const api = new awsApiGateway.RestApi(this, "GatewayAPI", {
      restApiName: "GatewayAPI",
      cloudWatchRole: true,
      deployOptions: {
        accessLogDestination: new awsApiGateway.LogGroupLogDestination(
          logGroup
        ),
        accessLogFormat: awsApiGateway.AccessLogFormat.jsonWithStandardFields({
          httpMethod: true,
          ip: true,
          protocol: true,
          requestTime: true,
          resourcePath: true,
          responseLength: true,
          status: true,
          caller: true,
          user: true,
        }),
      },
    });

    const createProductIntegration = new awsApiGateway.LambdaIntegration(
      props.createProductHandler
    );
    const findProductByIDIntegration = new awsApiGateway.LambdaIntegration(
      props.findProductByIDHandler
    );
    const findAllProductsIntegration = new awsApiGateway.LambdaIntegration(
      props.findAllProductsHandler
    );

    const productsRootResource = api.root.addResource("products");
    const productResource = productsRootResource.addResource("{id}");

    productsRootResource.addMethod("GET", findAllProductsIntegration);
    productsRootResource.addMethod("POST", createProductIntegration);

    productResource.addMethod("GET", findProductByIDIntegration);
    productResource.addMethod("PUT", createProductIntegration);
    productResource.addMethod("DELETE", createProductIntegration);
  }
}
