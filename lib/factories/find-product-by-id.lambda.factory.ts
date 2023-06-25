import { Duration } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface Environment {
  [key: string]: string;
}

export function findProductByIDLambdaFactory(
  scope: Construct,
  environment: Environment
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
  });
}
