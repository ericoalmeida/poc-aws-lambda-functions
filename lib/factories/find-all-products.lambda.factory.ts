import { Duration } from "aws-cdk-lib";
import { ILayerVersion, Tracing } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface Environment {
  [key: string]: string;
}

export function findAllProductsLambdaFactory(
  scope: Construct,
  environment: Environment,
  layers: ILayerVersion[],
  tracing: Tracing
): NodejsFunction {
  return new NodejsFunction(scope, "ProductsListingFunction", {
    functionName: "ProductsListingFunction",
    entry: "src/lambda/products/find-all-products.function.ts",
    handler: "handler",
    memorySize: 128,
    timeout: Duration.seconds(5),
    bundling: {
      minify: true,
      sourceMap: false,
    },
    environment,
    layers,
  });
}
