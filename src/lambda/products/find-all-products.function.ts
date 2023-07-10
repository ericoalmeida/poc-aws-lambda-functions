import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { captureAWS } from "aws-xray-sdk";

import { ProductRepository } from "/opt/nodejs/products-layer";

captureAWS(require("aws-sdk")); //Setting AWS XRAY to monitoring AWS SDK at all

const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME!
const PRODUCTS_LISTING_RESOURCE = "/product";

const dbClient = new DocumentClient(); //Dynamo DB instance
const repository = new ProductRepository(dbClient, PRODUCTS_TABLE_NAME);

function checkResourceIsValid(httpMethod: string, resource: string): boolean {
  return httpMethod === "GET" && resource === PRODUCTS_LISTING_RESOURCE;
}

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const { httpMethod, resource, requestContext } = event;
  const { requestId } = requestContext;
  const { awsRequestId } = context;

  console.log(`RequestID: ${requestId}, Lambda RequestID: ${awsRequestId}`);
  
  const resourceIsValid = checkResourceIsValid(httpMethod, resource);
  if (resourceIsValid) {
    const products = await repository.findAll();

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: "BAD REQUEST" }),
  };
}
