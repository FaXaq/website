import { list } from '@vercel/blob'

export default async function listBlobs() {
  return await list({ prefix: 'projects/corsica' })
}
