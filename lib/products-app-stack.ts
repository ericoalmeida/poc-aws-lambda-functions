import * as awsLambda from 'aws-lambda'
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs'
import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'

//Class to crate aws resources with cloud (stack)
export class ProductsAppStack extends cdk.Stack {
  //Public property that receives lambda function instance
  public readonly productsFetchHandler: lambda.NodejsFunction

  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope, id, props);

    this.productsFetchHandler = new lambda.NodejsFunction(this, "ProductsFetchFunction", {
      functionName: "ProductsFetchFunction",
      entry: "src/lambda/products/products-fetch-function.ts",
      handler: "handler",
      memorySize: 128,
      timeout: cdk.Duration.seconds(5),
      bundling: {
        minify: true,
        sourceMap: false,
      }
    })
  }
}