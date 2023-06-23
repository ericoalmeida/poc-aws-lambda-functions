import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

const PRODUCTS_FETCH_HTTP_METHOD = "GET"
const PRODUCTS_RESOURCE = "/products"
const PRODUCTS_RESOURCE_ID = "/products/{id}"

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>{
  const { resource, httpMethod, requestContext, pathParameters } = event
  const { awsRequestId } = context // "context" contains information about lambda function execution
  const { requestId } = requestContext // "requestContext" contains information about request

  if (httpMethod === PRODUCTS_FETCH_HTTP_METHOD){
    if(resource === PRODUCTS_RESOURCE){
      console.log(`GET: ${ resource }`);
      console.log(`RequestID: ${ requestId }, Lambda RequestID: ${ awsRequestId }`);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "GET products" })
      }
    }
  
    if(resource === PRODUCTS_RESOURCE_ID){
      console.log(`GET: /products/${ pathParameters!.id }`);
      console.log(`RequestID: ${ requestId }, Lambda RequestID: ${ awsRequestId }`);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "GET products by ID" })
      }
    }  
  }

  return {
    statusCode: 400,
    body: JSON.stringify({message: "BAD REQUEST"})
  }
}