import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

const CREATE_PRODUCT_RESOURCE = "/products";

function checkResourceIsValid(httpMethod: string, resource: string): boolean {
  return httpMethod === "POST" && resource === CREATE_PRODUCT_RESOURCE;
}

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const { httpMethod, resource, requestContext } = event;
  const { requestId } = requestContext;
  const { awsRequestId } = context;

  const resourceIsValid = checkResourceIsValid(httpMethod, resource);

  if (resourceIsValid) {
    console.log("POST: /products")
    console.log(`RequestID: ${requestId}, Lambda RequestID: ${awsRequestId}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "product created" }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: "BAD REQUEST " }),
  };
}
