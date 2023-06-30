// import * as AWSXRay from 'aws-xray-sdk'
import * as AWS from 'aws-sdk'

import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

export class ImagesAccess {
  constructor(
    private readonly s3: AWS.S3 = new AWS.S3({
      signatureVersion: 'v4'
    }),
    private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
  ) {}

  getUploadUrlForTodo(todoId: string) {
    logger.info(`Generating signed url for todo item`, {
      todoId,
      bucketName: this.bucketName
    })
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: Number(this.urlExpiration)
    })
  }
}
