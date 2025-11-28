export async function getFilesFromRequest(formData: FormData): Promise<Array<File>> {
  const files: Array<File> = [];

  for (const key of formData.keys()) {
    if (key.indexOf('file') > -1) {
      files.push(formData.get(key) as File);
    }
  }

  return files;
}
