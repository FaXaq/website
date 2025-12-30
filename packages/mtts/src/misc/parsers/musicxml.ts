export class MusicXMLParser {
  private readonly _document: Document;

  constructor (src: string) {
    const parser = new DOMParser()
    this._document = parser.parseFromString(src, 'text/xml')
  }

  get document (): XMLDocument {
    return this._document
  }
}
