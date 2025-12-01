import { S3_PATH_PREFIX } from "../procedures/mergeGpx/utils/consts";

export const generateS3Key = (filename: string, subPath?: string): string => {
  if (subPath) {
    return `${S3_PATH_PREFIX}${subPath}/${filename}`;
  }
  return `${S3_PATH_PREFIX}${filename}`;
}