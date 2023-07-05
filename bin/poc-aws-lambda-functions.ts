#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { ProductsAppStack } from "../lib/products-app-stack";
import { GatewayApiStack } from "../lib/gateway-api-stack";
import { ProductsAppLayersStack } from "../lib/products-app-layers-stack";

const app = new cdk.App();

const AWS_ACCOUNT = process.env.AWS_ACCOUNT!

const env: cdk.Environment = {
  account: AWS_ACCOUNT,
  region: "us-east-1",
};

const tags = {
  cost: "PocAWSLambdaFunctions",
  team: "AlmeidaTeam",
};

const productAppLayerStack = new ProductsAppLayersStack(app, "ProductsAppLayers", { tags, env });

const productAppStack = new ProductsAppStack(app, "ProductsApp", { tags, env });
productAppStack.addDependency(productAppLayerStack);

const gatewayApiStack = new GatewayApiStack(app, "GatewayApi", { tags, env });
gatewayApiStack.createProductAPIResources(productAppStack.resources);
gatewayApiStack.addDependency(productAppStack);
