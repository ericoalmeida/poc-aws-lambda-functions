import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Code, LayerVersion, Runtime } from "aws-cdk-lib/aws-lambda";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";

// Creates a infra for product layers
export class ProductsAppLayersStack extends Stack {
  private readonly productLayers: LayerVersion;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.productLayers = new LayerVersion(this, "ProductsDBLayer", {
      code: Code.fromAsset("src/lambda/layers/products-layer"),
      compatibleRuntimes: [Runtime.NODEJS_16_X],
      layerVersionName: "ProductsDBLayer",
      removalPolicy: RemovalPolicy.RETAIN,
    });

    //Saves layer version in a parameter
    new StringParameter(this, "ProductsDBLayerVersionArn", {
      parameterName: "ProductsDBLayerVersionArn",
      stringValue: this.productLayers.layerVersionArn,
    });
  }
}
