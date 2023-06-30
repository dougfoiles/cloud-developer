import * as AWSXRay from 'aws-xray-sdk'
import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
  DeleteItemCommand,
  UpdateItemCommand
} from '@aws-sdk/client-dynamodb'

import { TodoItem } from '../../models/TodoItem'
import { TodoUpdate } from '../../models/TodoUpdate'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

export class TodosAccess {
  constructor(
    private readonly docClient: DynamoDBClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosIndex = process.env.TODOS_CREATED_AT_INDEX
  ) {}

  async getTodosForUser(userId: string): Promise<any[]> {
    console.log('Getting all groups')

    const command = new QueryCommand({
      TableName: this.todosTable,
      IndexName: this.todosIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': { S: userId }
      }
    })

    const result = await this.docClient.send(command)

    const items = result.Items
    return items
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    const item = {
      userId: { S: todo.userId },
      todoId: { S: todo.todoId },
      createdAt: { S: todo.createdAt },
      name: { S: todo.name },
      dueDate: { S: todo.dueDate },
      done: { BOOL: todo.done }
    }

    logger.info('Access layer', item)
    const command = new PutItemCommand({
      TableName: this.todosTable,
      Item: item
    })

    await this.docClient.send(command)
    logger.info('Finished command', item)

    return todo
  }

  async deleteTodo(userId: string, todoId: string): Promise<void> {
    const deleteCommand = new DeleteItemCommand({
      TableName: this.todosTable,
      Key: {
        todoId: { S: todoId },
        userId: { S: userId }
      }
    })

    await this.docClient.send(deleteCommand)
  }

  async updateTodo(
    todoId: string,
    userId: string,
    todoUpdate: TodoUpdate
  ): Promise<void> {
    const command = new UpdateItemCommand({
      TableName: this.todosTable,
      Key: { todoId: { S: todoId }, userId: { S: userId } },
      AttributeUpdates: {
        // AttributeUpdates
        name: {
          // AttributeValueUpdate
          Value: { S: todoUpdate.name },
          Action: 'PUT'
        },
        dueDate: {
          // AttributeValueUpdate
          Value: { S: todoUpdate.dueDate },
          Action: 'PUT'
        },
        done: {
          // AttributeValueUpdate
          Value: { BOOL: todoUpdate.done },
          Action: 'PUT'
        }
      }
    })

    await this.docClient.send(command)
  }

  async updateTodoAttachment(
    todoId: string,
    userId: string,
    attachmentUrl: string
  ): Promise<void> {
    const command = new UpdateItemCommand({
      TableName: this.todosTable,
      Key: { todoId: { S: todoId }, userId: { S: userId } },
      AttributeUpdates: {
        // AttributeUpdates
        attachmentUrl: {
          // AttributeValueUpdate
          Value: { S: attachmentUrl },
          Action: 'PUT'
        }
      }
    })

    await this.docClient.send(command)
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    // return new XAWS.DynamoDB.DocumentClient({
    //   region: 'localhost',
    //   endpoint: 'http://localhost:8000'
    // })
  }
  return AWSXRay.captureAWSv3Client(new DynamoDBClient({}))
}
