// @TODO: transform into React component that styles .. differently
// @TODO: smarter formatting?
export function formatFilePath(path: string, maxCharacters = 30) {
  if (typeof path !== 'string' || path.length < maxCharacters) return path

  const parts = path.split('/')
  const fileName = parts.slice(-1)[0]
  const parentFolder = parts.slice(-2)[0]

  return ['..', parentFolder, fileName].join('/')
}
