import { NextRequest } from 'next/server'

export const getfileUrlFromRequest = async (request: NextRequest): Promise<string> => {
  const data = await request.formData()
  return data.get('fileUrl') as string
}
