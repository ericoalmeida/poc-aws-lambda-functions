import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

const PRODUCTS_FETCH_HTTP_METHOD = "GET"
const PRODUCTS_RESOURCE = "/products"

function checkResourceValid(resource: string, httpMethod: string): boolean {
  return resource === PRODUCTS_RESOURCE && PRODUCTS_FETCH_HTTP_METHOD === httpMethod
}

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>{
  const { resource, httpMethod, requestContext } = event
  const { awsRequestId } = context // "context" contains information about lambda function execution
  const { requestId } = requestContext // "requestContext" contains information about request

  const resourceValid = checkResourceValid(resource, httpMethod)

  if(resourceValid){
    console.log(`${httpMethod} ${resource}`);
    console.log(`RequestID: ${requestId}`);
    console.log(`Lambda RequestID: ${awsRequestId}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "GET products"
      })
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "BAD REQUEST"
    })
  }
}