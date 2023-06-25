#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductsAppStack } from '../lib/products-app-stack';
import { GatewayApiStack } from '../lib/gateway-api-stack';

const app = new cdk.App();

const env: cdk.Environment = {
  account: "...",
  region: "us-east-1"
}

const tags = {
  cost: "PocAWSLambdaFunctions",
  team: "AlmeidaTeam"
}

const productAppStack = new ProductsAppStack(app, "ProductsApp", { tags, env });

const gatewayApiStack = new GatewayApiStack(app, "GatewayApi", {
  findAllProductsHandler: productAppStack.findAllProductsHandler,
  findProductByIDHandler: productAppStack.findProductByIDHandler,
  productsAdminHandler: productAppStack.productsAdminHandler,
  tags,
  env
});

gatewayApiStack.addDependency(productAppStack);