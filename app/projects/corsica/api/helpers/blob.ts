import { S3_PATH_PREFIX } from '../../const'

export function getBlobPathname(filename: string): string {
  return S3_PATH_PREFIX + filename
}

export function getBlobFileName(pathname: string): string {
  return pathname.replace(S3_PATH_PREFIX, '')
}
