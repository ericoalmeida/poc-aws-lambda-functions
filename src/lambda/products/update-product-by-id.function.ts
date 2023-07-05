import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Product, ProductRepository } from "/opt/nodejs/products-layer";

const PRODUCT_PRODUCT_NAME = process.env.PRODUCT_PRODUCT_NAME!;
const UPDATE_PRODUCT_RESOURCES = "/product/{id}";

const dbClient = new DocumentClient();
const repository = new ProductRepository(dbClient, PRODUCT_PRODUCT_NAME);

function checkResourceIsValid(httpMethod: string, resource: string): boolean {
  return httpMethod === "PUT" && resource === UPDATE_PRODUCT_RESOURCES;
}

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const { httpMethod, resource, requestContext, pathParameters, body } = event;
  const { requestId } = requestContext;
  const { awsRequestId } = context;

  console.log(`RequestID: ${requestId}, Lambda RequestID: ${awsRequestId}`);

  const resourceIsValid = checkResourceIsValid(httpMethod, resource);

  if (resourceIsValid) {
    const productId = pathParameters!.id!;
    const requestData = JSON.parse(body!) as Product;
    const product = await repository.update(productId, requestData);

    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: "BAD REQUEST" }),
  };
}
