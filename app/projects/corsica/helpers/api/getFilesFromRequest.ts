import { NextRequest } from 'next/server'

export async function getFilesFromRequest(request: NextRequest): Promise<Array<File>> {
  const data = await request.formData()
  const values = data.values()
  let file = values.next()
  const files: Array<File> = []

  while (!file.done) {
    files.push(file.value)
    file = values.next()
  }

  return files
}
