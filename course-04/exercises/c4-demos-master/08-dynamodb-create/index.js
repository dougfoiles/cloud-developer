import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import uuid from 'uuid'

const docClient = new DynamoDBClient({ region: 'us-east-1' })

const groupsTable = process.env.GROUPS_TABLE

export const handler = async (event) => {
  console.log('Processing event: ', event)
  const itemId = uuid.v4()

  const parsedBody = JSON.parse(event.body)

  const newItem = {
    id: { S: itemId },
    name: { S: parsedBody.name },
    description: { S: parsedBody.description }
  }

  const command = new PutItemCommand({
    TableName: groupsTable,
    Item: newItem
  })

  await docClient.send(command)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newItem
    })
  }
}
