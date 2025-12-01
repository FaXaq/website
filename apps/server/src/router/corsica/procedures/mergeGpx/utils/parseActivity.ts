import { XMLParser } from 'fast-xml-parser';

import type { GPXJson } from '@repo/schemas/types/corsica';
import { XML_ATTRIBUTE_PREFIX } from './consts';

export async function parseGPX(file: Blob): Promise<GPXJson> {
  const text = await file.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: XML_ATTRIBUTE_PREFIX
  });

  return parser.parse(text) as GPXJson;
}
