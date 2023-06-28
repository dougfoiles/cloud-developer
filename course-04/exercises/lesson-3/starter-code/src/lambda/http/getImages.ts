import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";
import {
  DynamoDBClient,
  QueryCommand,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";

const docClient = new DynamoDBClient({});

const groupsTable = process.env.GROUPS_TABLE;
const imagesTable = process.env.IMAGES_TABLE;

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Caller event", event);
  const groupId = event.pathParameters.groupId;
  const validGroupId = await groupExists(groupId);

  if (!validGroupId) {
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Group does not exist",
      }),
    };
  }

  const images = await getImagesPerGroup(groupId);

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      items: images,
    }),
  };
};

async function groupExists(groupId: string) {
  const command = new GetItemCommand({
    TableName: groupsTable,
    Key: {
      id: { S: groupId },
    },
  });

  const result = await docClient.send(command);

  console.log("Get group: ", result);
  return !!result.Item;
}

async function getImagesPerGroup(groupId: string) {
  const command = new QueryCommand({
    TableName: imagesTable,
    KeyConditionExpression: "groupId = :groupId",
    ExpressionAttributeValues: {
      ":groupId": { S: groupId },
    },
    ScanIndexForward: false,
  });

  const result = await docClient.send(command);

  //   const result = await docClient.query({
  //     TableName: imagesTable,
  //     KeyConditionExpression: 'groupId = :groupId',
  //   ExpressionAttributeValues: {
  //     ':groupId': groupId
  //   },
  //   ScanIndexForward: false
  //   }).promise()

  return result.Items;
}
