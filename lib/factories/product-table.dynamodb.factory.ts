import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export function productTableDynamoDBFactory(scope: Construct): Table {
  return new Table(scope, "ProductsTable", {
    tableName: "products",
    removalPolicy: RemovalPolicy.DESTROY,
    partitionKey: {
      name: "id",
      type: AttributeType.STRING,
    },
    billingMode: BillingMode.PROVISIONED,
    readCapacity: 1,
    writeCapacity: 1,
  });
}
