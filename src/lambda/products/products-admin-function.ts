import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

const PRODUCTS_RESOURCE = "/products";
const PRODUCTS_RESOURCE_ID = "/products/{id}";

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const { resource, httpMethod, requestContext, pathParameters } = event;
  const { awsRequestId } = context; // "context" contains information about lambda function execution
  const { requestId } = requestContext; // "requestContext" contains information about request

  console.log(`RequestID: ${requestId}, Lambda RequestID: ${awsRequestId}`);

  if (resource === PRODUCTS_RESOURCE) {
    if (httpMethod === "POST") {
      console.log(`POST: ${resource}`);

      return {
        statusCode: 201,
        body: JSON.stringify({ message: "POST product" }),
      };
    }
  }

  if (resource === PRODUCTS_RESOURCE_ID) {
    if (httpMethod === "PUT") {
      console.log(`PUT: /products/${pathParameters!.id}`);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "PUT product changed by ID" }),
      };
    }

    if (httpMethod === "DELETE") {
      console.log(`DELETE: /products/${pathParameters!.id}`);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "DELETE product deleted by ID" }),
      };
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: "BAD REQUEST" }),
  };
}
