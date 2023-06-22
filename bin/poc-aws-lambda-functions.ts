#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductsAppStack } from '../lib/products-app-stack';
import { GatewayApiStack } from '../lib/gateway-api-stack';

const app = new cdk.App();

const env: cdk.Environment = {
  account: "646374137086",
  region: "us-east-1"
}

const tags = {
  cost: "PocAWSLambdaFunctions",
  team: "AlmeidaTeam"
}

const productAppStack = new ProductsAppStack(app, "ProductsApp", { tags, env });

const gatewayApiStack = new GatewayApiStack(app, "GatewayApi", {
  productsFetchHandler: productAppStack.productsFetchHandler,
  tags,
  env
});

gatewayApiStack.addDependency(productAppStack);