export async function getFilesFromRequest(formData: FormData): Promise<Array<File>> {
  const values = formData.values()
  let file = values.next()
  const files: Array<File> = []

  while (!file.done) {
    files.push(file.value)
    file = values.next()
  }

  return files
}
