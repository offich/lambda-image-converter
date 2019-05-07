'use strict'

const im = require('imagemagick')
const aws = require('aws-sdk')
const s3 = new aws.S3({ apiVersion: '2006-03-01' })

module.exports.lambdaImageConverter = (event, context, callback) => {
  const key = 'bands/' + event.bandId + '/' + event.filename
  const bucket = event.bucket
  const params = {
    Bucket: bucket,
    Key: key,
  }

  let resizedWidth = event.w

  if (resizedWidth) {
    if (['72', '144', '198', '396', '300', '600', '460', '920'].indexOf(resizedWidth) == -1) {
      const message = `Invalid width ${resizedWidth}, ${key} from bucket ${bucket}`
      console.log(message)
      callback(message)
    }
  } else {
    resizedWidth = '720'
  }

  s3.getObject(params, (err, data) => {
    if (err) {
      console.log(err)
      const message = `Error getting object ${key} from bucket ${bucket}`
      console.log(message)
      callback(message)
    } else {
      im.resize(
        {
          srcData: data.Body,
          format: 'jpg',
          width: resizedWidth,
        },
        (err, stdout) => {
          if (err) {
            console.log(err)
            callback('resize failed', err)
          } else {
            callback(null, new Buffer(stdout, 'binary').toString('base64'))
          }
        }
      )
    }
  })
}
