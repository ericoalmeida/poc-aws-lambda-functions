import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { captureAWS } from "aws-xray-sdk";

import { ProductRepository } from "/opt/nodejs/products-layer";

captureAWS(require("aws-sdk")); //Setting AWS XRAY to monitoring AWS SDK at all

const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME!;
const UPDATE_PRODUCT_RESOURCES = "/product/{id}";

const dbClient = new DocumentClient();
const repository = new ProductRepository(dbClient, PRODUCTS_TABLE_NAME);

function checkResourceIsValid(httpMethod: string, resource: string): boolean {
  return httpMethod === "DELETE" && resource === UPDATE_PRODUCT_RESOURCES;
}

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const { httpMethod, resource, requestContext, pathParameters } = event;
  const { requestId } = requestContext;
  const { awsRequestId } = context;

  console.log(`RequestID: ${requestId}, Lambda RequestID: ${awsRequestId}`);

  const resourceIsValid = checkResourceIsValid(httpMethod, resource);

  if (resourceIsValid) {
    try {
      const productId = pathParameters!.id!;

      const product = await repository.delete(productId);

      return {
        statusCode: 200,
        body: JSON.stringify(product),
      };
    } catch (error) {
      console.error((<Error>error).message);

      return {
        statusCode: 404,
        body: JSON.stringify((<Error>error).message),
      };
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: "BAD REQUEST" }),
  };
}
