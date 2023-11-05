import { BLOB_PREFIX } from './const'

export function getBlobPathname(filename: string): string {
  return BLOB_PREFIX + filename
}

export function getBlobFileName(pathname: string): string {
  return pathname.replace(BLOB_PREFIX, '')
}
