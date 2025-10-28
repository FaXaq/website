import { XMLParser } from 'fast-xml-parser';

import type { GPXJson } from '../../analyse/types';
import { XML_ATTRIBUTE_PREFIX } from '../../const';

export async function parseGPX(file: Blob): Promise<GPXJson> {
  const text = await file.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: XML_ATTRIBUTE_PREFIX
  });

  return parser.parse(text) as GPXJson;
}
