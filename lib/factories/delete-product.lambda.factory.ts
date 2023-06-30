import { Duration } from "aws-cdk-lib";
import { ILayerVersion } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface Environment {
  [key: string]: string;
}

export function deleteProductByIDLambdaFactory(
  scope: Construct,
  environment: Environment,
  layers: ILayerVersion[]
): NodejsFunction {
  return new NodejsFunction(scope, "DeleteProductByID", {
    functionName: "DeleteProductByID",
    entry: "src/lambda/products/delete-product-by-id.function.ts",
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
