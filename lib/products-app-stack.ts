import * as awsLambda from "aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { findAllProductsLambdaFactory } from "./factories/find-all-products.lambda.factory";
import { findProductByIDLambdaFactory } from "./factories/find-product-by-id.lambda.factory";
import { createProductLambdaFactory } from "./factories/create-product.lambda.factory";
import { productTableDynamoDBFactory } from "./factories/product-table.dynamodb.factory";

// export interface ProductResources {
//   findById: lambda.NodejsFunction
// }

//Class to crate aws resources with cloud (stack)
export class ProductsAppStack extends cdk.Stack {
  public readonly findAllProductsHandler: lambda.NodejsFunction;
  public readonly findProductByIDHandler: lambda.NodejsFunction;
  public readonly createProductHandler: lambda.NodejsFunction;
  public readonly productsDDB: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creating a dynamoDB table resource
    this.productsDDB = productTableDynamoDBFactory(this);

    // Creating a lambda function resource
    this.createProductHandler = createProductLambdaFactory(this, {
      PRODUCTS_TABLE_NAME: this.productsDDB.tableName,
    });
    this.findAllProductsHandler = findAllProductsLambdaFactory(this, {
      PRODUCTS_TABLE_NAME: this.productsDDB.tableName,
    });
    this.findProductByIDHandler = findProductByIDLambdaFactory(this, {
      PRODUCTS_TABLE_NAME: this.productsDDB.tableName,
    });

    // Set permissions
    this.productsDDB.grantReadData(this.findProductByIDHandler);
    this.productsDDB.grantReadData(this.findAllProductsHandler);
    this.productsDDB.grantWriteData(this.createProductHandler);
  }
}
