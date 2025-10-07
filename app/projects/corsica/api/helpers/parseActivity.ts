import { XMLParser } from 'fast-xml-parser'
import { XML_ATTRIBUTE_PREFIX } from '../../const'
import { GPXJson } from '../../analyse/types'

export async function parseGPX(file: Blob): Promise<GPXJson> {
  const text = await file.text()
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: XML_ATTRIBUTE_PREFIX
  })

  return parser.parse(text) as GPXJson
}
