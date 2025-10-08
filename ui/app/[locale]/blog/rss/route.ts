import { Feed } from 'feed';
import { readdirSync, readFileSync } from "fs";
import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import path from 'path';

const articlesDir = path.join(process.cwd(), 'app/blog');
const files = readdirSync(articlesDir).filter(i => i.indexOf('.') === -1);
const fileUrls = [];

for (let i = 0; i < files.length; i++) {
  const currentPath = path.join(articlesDir, files[i]);
  const f = readdirSync(currentPath);
  if (f.indexOf('page.mdx') > -1) {
    const content = readFileSync(path.join(process.cwd(), 'app/blog', files[i], 'page.mdx'));
    fileUrls.push({
      url: `https://norra.fr/blog/${files[i]}`,
      content: content.toString()
    });
  }
}

interface MetaObject {
    title: string,
    description: string
    creationDate: string,
    tags: Array<string>,
    published: boolean
}

function extractMetaObject(str: string) {
  const regexp = new RegExp('meta = (\\{[^<]*\\})');
  return str.match(regexp);
}

function parseMeta(str: string): MetaObject {
  // We extract meta object from our content string
  const metaString = extractMetaObject(str)[0]
    .replace('meta =', '')
    .replace(/([a-zA-Z0-9-]+):/g, "\"$1\":")
    // replace single quotes with double quotes in property string values
    .replace(/:\s*'/g, ':"')
    .replace(/',/g, '",')
    // replace single quotes with double quotes in property Array values
    .replace(/:\s*\['/g, ':["')
    .replace(/",\s'/g, '","')
    .replace(/'\s*\]/g, '"]');
  return JSON.parse(metaString);
}

function parseContent(str: string): string {
  // We extract meta object from our content string
  const match = str.match(/<BlogPostLayout meta={meta}>(.|\n)*<\/BlogPostLayout>/g)[0];
  return match.replace('<BlogPostLayout meta={meta}>\n', '').replace('</BlogPostLayout>', '');
}

export async function GET(request: NextRequest) {
  const feed = new Feed({
    title: 'norra.fr blog',
    id: 'https://norra.fr/blog',
    link: 'https://norra.fr/blog',
    copyright: `Marin Procureur ©${new Date().getFullYear()}`
  });

  for (let i = 0; i < fileUrls.length; i++) {
    // const response = await fetch(fileUrls[i].url)
    // const responseText = await response.text()
    const meta = parseMeta(fileUrls[i].content);
    const content = parseContent(fileUrls[i].content);
    if (meta.published) {
      feed.addItem({
        date: new Date(meta.creationDate),
        title: meta.title,
        description: meta.description,
        link: fileUrls[i].url,
        content
      });
    }
  }

  return new NextResponse(feed.rss2(), { headers: { "Content-Type": "text/xml" } });
}