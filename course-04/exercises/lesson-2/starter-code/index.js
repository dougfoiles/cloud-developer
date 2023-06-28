import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const docClient = new DynamoDBClient({ region: "us-east-1" });

const groupsTable = process.env.GROUPS_TABLE;

export const handler = async (event) => {
  console.log("Processing event: ", event);
  let nextKey;
  let limit;

  try {
    nextKey = parseNextKey(event);
    limit = parseLimit(event);
  } catch (err) {
    console.log("Error: ", err.message);
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Invalid parameters",
      }),
    };
  }

  // Scan operation parameters
  const scanParams = {
    TableName: groupsTable,
    Limit: limit,
    ExclusiveStartKey: nextKey,
  };

  const command = new ScanCommand({
    ...scanParams,
  });

  console.log("Scan params: ", scanParams);

  const result = await docClient.send(command);

  const items = result.Items;

  console.log("Result: ", result);

  // Return result
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      items,
      // Encode the JSON object so a client can return it in a URL as is
      nextKey: encodeNextKey(result.LastEvaluatedKey),
    }),
  };
};

const parseLimit = (event) => {
  let limit = getQueryParameter(event, "limit");
  limit = parseInt(limit, 10);
  if (!limit || limit < 0) {
    throw new Error("Invalid limit");
  }

  return limit;
};

const parseNextKey = (event) => {
  let nextKey = getQueryParameter(event, "nextKey");

  if (!nextKey) return undefined;
  console.log("before ", nextKey);
  const decoded = decodeURIComponent(nextKey);
  console.log("decoded ", decoded);
  nextKey = JSON.parse(decoded);
  console.log("after ", nextKey);
  return nextKey;
};

/**
 * Get a query parameter or return "undefined"
 *
 * @param {Object} event HTTP event passed to a Lambda function
 * @param {string} name a name of a query parameter to return
 *
 * @returns {string} a value of a query parameter value or "undefined" if a parameter is not defined
 */
function getQueryParameter(event, name) {
  const queryParams = event.queryStringParameters;
  if (!queryParams) {
    return undefined;
  }

  return queryParams[name];
}

/**
 * Encode last evaluated key using
 *
 * @param {Object} lastEvaluatedKey a JS object that represents last evaluated key
 *
 * @return {string} URI encoded last evaluated key
 */
function encodeNextKey(lastEvaluatedKey) {
  if (!lastEvaluatedKey) {
    return null;
  }

  return encodeURIComponent(JSON.stringify(lastEvaluatedKey));
}
