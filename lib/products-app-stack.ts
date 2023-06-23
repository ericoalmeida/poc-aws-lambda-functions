import * as awsLambda from 'aws-lambda'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs'
import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'

//Class to crate aws resources with cloud (stack)
export class ProductsAppStack extends cdk.Stack {
  public readonly productsFetchHandler: lambda.NodejsFunction
  public readonly productsDDB: dynamodb.Table

  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope, id, props);

    // Creating a dynamoDB table resource
    this.productsDDB = new dynamodb.Table(this, "ProductsDDB", {
      tableName: "products",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
    });
    
    // Creating a lambda function resource
    this.productsFetchHandler = new lambda.NodejsFunction(this, "ProductsFetchFunction", {
      functionName: "ProductsFetchFunction",
      entry: "src/lambda/products/products-fetch-function.ts",
      handler: "handler",
      memorySize: 128,
      timeout: cdk.Duration.seconds(5),
      bundling: {
        minify: true,
        sourceMap: false,
      },
      environment: {
        PRODUCTS_TABLE_NAME: this.productsDDB.tableName
      }
    });

    // Set permissions
    this.productsDDB.grantReadData(this.productsFetchHandler);
  }
}