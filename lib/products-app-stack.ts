import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { createProductLambdaFactory } from "./factories/create-product.lambda.factory";
import { deleteProductByIDLambdaFactory } from "./factories/delete-product.lambda.factory";
import { findAllProductsLambdaFactory } from "./factories/find-all-products.lambda.factory";
import { findProductByIDLambdaFactory } from "./factories/find-product-by-id.lambda.factory";
import { productTableDynamoDBFactory } from "./factories/product-table.dynamodb.factory";
import { updateProductByIDLambdaFactory } from "./factories/update-product.lambda.factory";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { LayerVersion, Tracing } from "aws-cdk-lib/aws-lambda";

export interface ProductResources {
  create: lambda.NodejsFunction;
  deleteById: lambda.NodejsFunction;
  findAll: lambda.NodejsFunction;
  findById: lambda.NodejsFunction;
  updateById: lambda.NodejsFunction;
}

//Class to crate aws resources with cloud (stack)
export class ProductsAppStack extends cdk.Stack {
  private readonly table: dynamodb.Table;

  public readonly resources: ProductResources;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creating a dynamoDB table resource
    this.table = productTableDynamoDBFactory(this);

    // Get parameter from AWS SSM
    const productsDBLayerArn = StringParameter.valueForStringParameter(
      this,
      "ProductsDBLayerVersionArn"
    );
    const productsDBLayer = LayerVersion.fromLayerVersionArn(
      this,
      "ProductsDBLayerVersionArn",
      productsDBLayerArn
    );

    const layers = [productsDBLayer];
    const tracing = Tracing.ACTIVE; // Active AWS X-Ray Tracing

    // Creating a lambda function resource
    this.resources = {
      create: createProductLambdaFactory(
        this,
        { PRODUCTS_TABLE_NAME: this.table.tableName },
        layers,
        tracing
      ),
      deleteById: deleteProductByIDLambdaFactory(
        this,
        { PRODUCTS_TABLE_NAME: this.table.tableName },
        layers,
        tracing
      ),
      findAll: findAllProductsLambdaFactory(
        this,
        { PRODUCTS_TABLE_NAME: this.table.tableName },
        layers,
        tracing
      ),
      findById: findProductByIDLambdaFactory(
        this,
        { PRODUCTS_TABLE_NAME: this.table.tableName },
        layers,
        tracing
      ),
      updateById: updateProductByIDLambdaFactory(
        this,
        { PRODUCTS_TABLE_NAME: this.table.tableName },
        layers,
        tracing
      ),
    };

    // Set permissions
    this.table.grantWriteData(this.resources.create);
    this.table.grantReadData(this.resources.findAll);
    this.table.grantReadData(this.resources.findById);
    this.table.grantWriteData(this.resources.updateById);
    this.table.grantWriteData(this.resources.deleteById);
  }
}
