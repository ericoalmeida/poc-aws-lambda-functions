import { Duration } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface Environment {
  [key: string]: string;
}

export function createProductLambdaFactory(
  scope: Construct,
  environment: Environment
): NodejsFunction {
  return new NodejsFunction(scope, "CreateProduct", {
    functionName: "CreateProduct",
    entry: "src/lambda/products/create-product.function.ts",
    handler: "handler",
    memorySize: 128,
    timeout: Duration.seconds(5),
    bundling: {
      minify: true,
      sourceMap: false,
    },
    environment
  })
}
