exports.successJson = (contentType, body, cachingDays = 7) => {
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

exports.getContentType = requestedFileExtension => {
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
