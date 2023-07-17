import { Duration } from "aws-cdk-lib";
import { ILayerVersion, LambdaInsightsVersion, Tracing } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface Environment {
  [key: string]: string;
}

export function findProductByIDLambdaFactory(
  scope: Construct,
  environment: Environment,
  layers: ILayerVersion[],
  tracing: Tracing,
  insightsVersion: LambdaInsightsVersion
): NodejsFunction {
  return new NodejsFunction(scope, "FindProductByID", {
    functionName: "FindProductByID",
    entry: "src/lambda/products/find-product-by-id.function.ts",
    handler: "handler",
    memorySize: 128,
    timeout: Duration.seconds(5),
    bundling: {
      minify: true,
      sourceMap: false,
    },
    environment,
    layers,
    tracing,
    insightsVersion
  });
}
