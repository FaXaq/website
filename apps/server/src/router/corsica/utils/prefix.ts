import { CorsicaScope } from "@repo/schemas/api/procedures/corsica";
import z from "zod";

export const S3_PATH_PREFIX = '/projects/corsica/';
export const ANALYSE_CUSTOM_PREFIX = 'analyse/custom/';
export const ANALYSE_EXAMPLES_PREFIX = 'analyse/examples/';
export const MERGE_PREFIX = 'merge';

export const getScopePrefix = (scope: z.infer<typeof CorsicaScope>): string => {
  switch (scope) {
    case 'analyse/example':
      return ANALYSE_EXAMPLES_PREFIX;
    case 'analyse/custom':
      return ANALYSE_CUSTOM_PREFIX;
    case 'merge':
      return MERGE_PREFIX;
    default: return '';
  }
}

export const addS3PathPrefix = (key: string): string => {
  return S3_PATH_PREFIX + key;
}

export const removeS3PathPrefix = (key: string): string => {
  return key.replace(S3_PATH_PREFIX, '');
}

export const removeExamplesPrefix = (key: string): string => {
  return key.replace(ANALYSE_EXAMPLES_PREFIX, '');
}

export const addExamplesPrefix = (key: string): string => {
  return ANALYSE_EXAMPLES_PREFIX + key;
}

export const generateS3Key = (filename: string, scope?: z.infer<typeof CorsicaScope>): string => {
  if (scope) {
    return `${S3_PATH_PREFIX}${getScopePrefix(scope)}${filename}`;
  }
  return `${S3_PATH_PREFIX}${filename}`;
}