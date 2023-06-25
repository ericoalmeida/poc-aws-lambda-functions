import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

const PRODUCT_FINDING_RESOURCE = "/products/{id}";

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

  const resourceIsValid = checkResourceIsInvalid(httpMethod, resource);

  if (resourceIsValid) {
    const productId = pathParameters!.id;

    console.log(`GET: /products/"${productId}"`);
    console.log(`RequestID: ${requestId}, Lambda RequestID: ${awsRequestId}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Find product by ID" }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: "BAD REQUEST" }),
  };
}
