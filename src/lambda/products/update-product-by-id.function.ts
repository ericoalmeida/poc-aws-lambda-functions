import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

const UPDATE_PRODUCT_RESOURCES = "/product/{id}";

function checkResourceIsValid(httpMethod: string, resource: string): boolean {
  return httpMethod === "PUT" && resource === UPDATE_PRODUCT_RESOURCES;
}

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const { httpMethod, resource, requestContext, pathParameters } = event;
  const { requestId } = requestContext;
  const { awsRequestId } = context;

  const resourceIsValid = checkResourceIsValid(httpMethod, resource);

  if (resourceIsValid) {
    const productId = pathParameters!.id;

    console.log(`PUT: /products/"${productId}"`);
    console.log(`RequestID: ${requestId}, Lambda RequestID: ${awsRequestId}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Product updated" }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: "BAD REQUEST" }),
  };
}
