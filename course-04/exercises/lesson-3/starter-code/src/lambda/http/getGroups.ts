import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const docClient = new DynamoDBClient({});

const groupsTable = process.env.GROUPS_TABLE;

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Processing event: ", event);

  const command = new ScanCommand({
    TableName: groupsTable,
  });

  const result = await docClient.send(command);

  const items = result.Items;

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      items,
    }),
  };
};
