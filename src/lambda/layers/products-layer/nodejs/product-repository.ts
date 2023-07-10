// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { v4 } from "uuid";

export interface Product {
  id: string;
  description: string;
  code: string;
  price: number;
  model: string;
  url: string;
}

export class ProductRepository {
  constructor(
    private readonly dbCLient: DocumentClient,
    private readonly table: string
  ) {}

  public async findAll(): Promise<Product[]> {
    //avoid dynamoDB "Scan" for performance and costs issues
    const data = await this.dbCLient
      .scan({
        TableName: this.table,
      })
      .promise();

    return data.Items as Product[];
  }

  public async find(id: string): Promise<Product> {
    const data = await this.dbCLient
      .get({
        TableName: this.table,
        Key: { id },
      })
      .promise();

    if (!data.Item) {
      throw new Error("Product not found");
    }

    return data.Item as Product;
  }

  public async create(product: Product): Promise<Product> {
    product.id = v4();

    await this.dbCLient
      .put({
        TableName: this.table,
        Item: product,
      })
      .promise();

    return product;
  }

  public async delete(id: string): Promise<Product> {
    const data = await this.dbCLient
      .delete({
        TableName: this.table,
        Key: { id },
        ReturnValues: "ALL_OLD",
      })
      .promise();

    if (!data.Attributes) {
      throw new Error("Product not found");
    }

    return data.Attributes as Product;
  }

  public async update(id: string, product: Product): Promise<Product> {
    const data = await this.dbCLient
      .update({
        TableName: this.table,
        Key: { id },
        ConditionExpression: "attribute_exists(id)",
        ReturnValues: "UPDATED_NEW",
        UpdateExpression:
          "set description = :n, code = :c, price = :p, model = :m, url = :u",
        ExpressionAttributeValues: {
          ":n": product.description,
          ":c": product.code,
          ":p": product.price,
          ":m": product.model,
          ":u": product.url,
        },
      })
      .promise();

    data.Attributes!.id = id;
    return data.Attributes as Product;
  }
}
