import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import * as uuid from "uuid";

const docClient = new DynamoDBClient({});

const groupsTable = process.env.GROUPS_TABLE;

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Processing event: ", event);
  const itemId = uuid.v4();

  const parsedBody = JSON.parse(event.body);

  const newItem = {
    id: { S: itemId },
    name: { S: parsedBody.name },
    description: { S: parsedBody.description },
  };

  const command = new PutItemCommand({
    TableName: groupsTable,
    Item: newItem,
  });

  await docClient.send(command);

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      newItem,
    }),
  };
};
