import { Duration } from "aws-cdk-lib";
import { ILayerVersion } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface Environment {
  [key: string]: string;
}

export function updateProductByIDLambdaFactory(
  scope: Construct,
  environment: Environment,
  layers: ILayerVersion[]
): NodejsFunction {
  return new NodejsFunction(scope, "UpdateProductByID", {
    functionName: "UpdateProductByID",
    entry: "src/lambda/products/update-product-by-id.function.ts",
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
