interface TextValues {
  newName: string
}

export async function getNewNameFromRequest(formData: FormData): Promise<TextValues> {
  return {
    newName: formData.get('newName') as string || ''
  };
}
