import * as awsLambda from "aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { createProductLambdaFactory } from "./factories/create-product.lambda.factory";
import { findAllProductsLambdaFactory } from "./factories/find-all-products.lambda.factory";
import { findProductByIDLambdaFactory } from "./factories/find-product-by-id.lambda.factory";
import { productTableDynamoDBFactory } from "./factories/product-table.dynamodb.factory";

export interface ProductResources {
  findById: lambda.NodejsFunction;
  findAll: lambda.NodejsFunction;
  create: lambda.NodejsFunction;
}

//Class to crate aws resources with cloud (stack)
export class ProductsAppStack extends cdk.Stack {
  private readonly table: dynamodb.Table;

  public readonly resources: ProductResources;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creating a dynamoDB table resource
    this.table = productTableDynamoDBFactory(this);

    // Creating a lambda function resource
    this.resources.create = createProductLambdaFactory(this, {
      PRODUCTS_TABLE_NAME: this.table.tableName,
    });
    this.resources.findAll = findAllProductsLambdaFactory(this, {
      PRODUCTS_TABLE_NAME: this.table.tableName,
    });
    this.resources.findById = findProductByIDLambdaFactory(this, {
      PRODUCTS_TABLE_NAME: this.table.tableName,
    });

    // Set permissions
    this.table.grantReadData(this.resources.findAll);
    this.table.grantReadData(this.resources.findById);
    this.table.grantWriteData(this.resources.create);
  }
}
