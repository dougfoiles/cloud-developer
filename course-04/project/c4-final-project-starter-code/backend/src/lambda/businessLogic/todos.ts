import * as uuid from 'uuid'

import { TodoItem } from '../../models/TodoItem'
import { TodosAccess } from '../dataLayer/todosAccess'
import { ImagesAccess } from '../dataLayer/imagesAccess'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

const todosAccess = new TodosAccess()
const imagesAccess = new ImagesAccess()
const attachmentBucketName = process.env.ATTACHMENT_S3_BUCKET

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  return await todosAccess.getTodosForUser(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const todoId = uuid.v4()
  logger.info('Creating todo', createTodoRequest)
  return await todosAccess.createTodo({
    userId: userId,
    todoId: todoId,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    attachmentUrl: undefined
  })
}

export async function deleteTodo(
  userId: string,
  todoId: string
): Promise<void> {
  await todosAccess.deleteTodo(userId, todoId)
}

export async function updateTodo(
  todoId: string,
  userId: string,
  updateTodoRequest: UpdateTodoRequest
): Promise<void> {
  await todosAccess.updateTodo(todoId, userId, {
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done
  })
}

export async function createAttachmentPresignedUrl(
  todoId: string,
  userId: string
): Promise<string> {
  const signedUrl: string = imagesAccess.getUploadUrlForTodo(todoId)

  await todosAccess.updateTodoAttachment(
    todoId,
    userId,
    `https://${attachmentBucketName}.s3.amazonaws.com/${todoId}`
  )
  logger.info('Created signedUrl', { signedUrl, todoId, userId })

  return signedUrl
}
