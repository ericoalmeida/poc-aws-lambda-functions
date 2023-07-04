import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Product, ProductRepository } from "/opt/nodejs/products-layer";

const PRODUCT_TABLE_NAME = process.env.PRODUCT_TABLE_NAME!;
const CREATE_PRODUCT_RESOURCE = "/product";

const dbClient = new DocumentClient();
const repository = new ProductRepository(dbClient, PRODUCT_TABLE_NAME);

function checkResourceIsValid(httpMethod: string, resource: string): boolean {
  return httpMethod === "POST" && resource === CREATE_PRODUCT_RESOURCE;
}

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const { httpMethod, resource, requestContext, body } = event;
  const { requestId } = requestContext;
  const { awsRequestId } = context;

  console.log(`RequestID: ${requestId}, Lambda RequestID: ${awsRequestId}`);

  const resourceIsValid = checkResourceIsValid(httpMethod, resource);

  if (resourceIsValid) {
    const requestData = JSON.parse(body!) as Product;

    const product = await repository.create(requestData);

    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: "BAD REQUEST " }),
  };
}
