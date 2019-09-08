'use strict'

const path = require('path')
const sharp = require('sharp')
const aws = require('aws-sdk')
const s3 = new aws.S3({ apiVersion: '2006-03-01' })

const { availableResizeWidths } = require('common/constant')
const { successJson, getContentType } = require('common/response')

module.exports.handler = (event, context, callback) => {
  const { pathParameters, queryStringParameters, stageVariables } = event
  const { resouceid, filename } = pathParameters
  const { bucket } = stageVariables
  const parsedFile = path.parse(filename)

  const key = `resource/${resouceid}/${parsedFile.base}`
  const convertOptions = { webp: parsedFile.ext == '.webp', resizeWidth: '320' }

  const requestedWidth = queryStringParameters ? queryStringParameters.w : ''
  if (requestedWidth && !availableResizeWidths.includes(requestedWidth)) {
    callback(`[ERROR]: Invalid width ${requestedWidth}. key: ${key} from bucket ${bucket}`)
  } else if (requestedWidth) {
    convertOptions.resizeWidth = requestedWidth
  }

  s3.getObject({ Bucket: bucket, Key: key })
    .promise()
    .catch(err => {
      throw new Error(`[ERROR]: Error getting object key ${key} from bucket ${bucket}. err: ${err}`)
    })
    .then(data => {
      const sharpPromise = sharp(data.Body)
      if (convertOptions.resizeWidth) sharpPromise.resize({ width: parseInt(convertOptions.resizeWidth) })
      if (convertOptions.webp) sharpPromise.webp({ quality: 75 })

      return sharpPromise.toBuffer()
    })
    .then(buffer => {
      callback(null, successJson(getContentType(parsedFile.ext), buffer.toString('base64')))
    })
    .catch(err => `[ERROR]: ${err}`)
}
