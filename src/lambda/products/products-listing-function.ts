import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

const PRODUCTS_LISTING_RESOURCE = "/products";

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

  const resourceIsValid = checkResourceIsValid(httpMethod, resource);

  console.log(`RequestID: ${ requestId }, Lambda RequestID: ${ awsRequestId }`);

  if (resourceIsValid) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "GET: list all products" }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: "BAD REQUEST" }),
  };
}
