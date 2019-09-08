'use strict'

const path = require('path')
const sharp = require('sharp')
const aws = require('aws-sdk')
const s3 = new aws.S3({ apiVersion: '2006-03-01' })
const availableResizeWidths = ['72', '144', '198', '300', '396', '460', '600', '920']

const successJson = (contentType, body, cachingDays = 7) => {
  const date = new Date()
  date.setDate(date.getDate() + cachingDays)

  return {
    isBase64Encoded: true,
    statusCode: 200,
    headers: {
      'Content-type': contentType,
      'Cache-Control': `max-age=${cachingDays * 60 * 60 * 24}`,
      Expires: date.toUTCString(),
    },
    body,
  }
}

const getContentType = requestedFileExtension => {
  switch (requestedFileExtension) {
    case '.jpg':
      return 'image/jpeg'
    case '.png':
      return 'image/png'
    case '.webp':
      return 'image/webp'
  }

  return ''
}

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
