import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";
import "source-map-support/register";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const docClient = new DynamoDBClient({});

const imagesTable = process.env.IMAGES_TABLE;
const imageIdIndex = process.env.IMAGE_ID_INDEX;

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Caller event", event);
  const imageId = event.pathParameters.imageId;

  const command = new QueryCommand({
    TableName: imagesTable,
    IndexName: imageIdIndex,
    KeyConditionExpression: "imageId = :imageId",
    ExpressionAttributeValues: {
      ":imageId": { S: imageId },
    },
  });

  const result = await docClient.send(command);

  if (result.Count !== 0) {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(result.Items[0]),
    };
  }

  return {
    statusCode: 404,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: "",
  };
};
