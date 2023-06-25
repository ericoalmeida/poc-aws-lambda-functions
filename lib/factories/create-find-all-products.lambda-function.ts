import { Duration } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface Environment {
  [key: string]: string;
}

export function createFindAllProductsLambdaFunction(
  scope: Construct,
  environment: Environment
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
  });
}
