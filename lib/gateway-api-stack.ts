import * as cdk from "aws-cdk-lib";
import * as awsApiGateway from "aws-cdk-lib/aws-apigateway";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

import { ProductResources } from "./products-app-stack";

export class GatewayApiStack extends cdk.Stack {
  private readonly api: awsApiGateway.RestApi;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, "GatewayAPILogs");
    this.api = new awsApiGateway.RestApi(this, "GatewayAPI", {
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
  }

  public createProductAPIResources(resources: ProductResources): void {
    const createProductLambdaIntegration = new awsApiGateway.LambdaIntegration(
      resources.create
    );

    const findAllProductsLambdaIntegration = new awsApiGateway.LambdaIntegration(
      resources.findAll
    );

    const findByIdLambdaIntegration = new awsApiGateway.LambdaIntegration(
      resources.findById
    );

    const rootResource = this.api.root.addResource("products"); // /products
    rootResource.addMethod("GET", findAllProductsLambdaIntegration);
    rootResource.addMethod("POST", createProductLambdaIntegration);
    
    const paramIdResource = rootResource.addResource("{id}"); // /products/{id}
    paramIdResource.addMethod("GET", findByIdLambdaIntegration);
  }
}
