import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { ProductRepository } from "/opt/nodejs/products-layer";

const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME!;
const PRODUCT_FINDING_RESOURCE = "/product/{id}";

const dbClient = new DocumentClient();
const repository = new ProductRepository(dbClient, PRODUCTS_TABLE_NAME);

function checkResourceIsInvalid(httpMethod: string, resource: string): boolean {
  return httpMethod === "GET" && resource === PRODUCT_FINDING_RESOURCE;
}

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const { httpMethod, resource, pathParameters, requestContext } = event;
  const { requestId } = requestContext;
  const { awsRequestId } = context;

  console.log(`RequestID: ${requestId}, Lambda RequestID: ${awsRequestId}`);

  const resourceIsValid = checkResourceIsInvalid(httpMethod, resource);

  if (resourceIsValid) {
    const productId = pathParameters!.id!;

    try {
      const product = await repository.find(productId);

      return {
        statusCode: 200,
        body: JSON.stringify(product),
      };
    } catch (error) {
      console.error((<Error>error).message);

      return {
        statusCode: 404,
        body: JSON.stringify({ message: (<Error>error).message }),
      };
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: "BAD REQUEST" }),
  };
}
