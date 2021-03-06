import React from 'react'
// eslint-disable-next-line no-unused-vars
import { NextPage } from 'next'
import Link from 'next/link'
import path from 'path'
import { useTranslation } from 'react-i18next'

export interface ArticleMetaData {
  title: string
  description: string
  creationDate: Date
}

interface Article {
  meta: ArticleMetaData
  link: string
}

interface BlogProps {
  articles: Article[];
}

const Blog: NextPage<BlogProps> = function ({ articles }: BlogProps) {
  const { t } = useTranslation()

  const links = articles.map((a, i) => {
    return (
      <li key={`article-${i}`} className="my-4">
        <Link href={`${a.link}`}>
          <a>
            <div>
              <h3 className="font-mtts-title font-semibold text-2xl my-2">{a.meta.title}</h3>
              <p>{a.meta.description ? a.meta.description : '' } - <em>{t('format.date', { date: new Date(a.meta.creationDate) })}</em></p>
            </div>
          </a>
        </Link>
      </li>
    )
  })
  return (
    <div className="font-sans container mx-auto px-4">
      <h1 className="text-8xl font-bold font-mtts-title">{t('blog.title')}</h1>
      <ul className="flex flex-col">
        {links.length > 0 ? links : 'No blog post yet...'}
      </ul>
    </div>
  )
}

Blog.getInitialProps = async (_) => {
  const articles = await (async context => {
    return await Promise.all(context.keys().map(async (k) => {
      const postContent = await import(`./${k.replace('./', '')}`)
      return {
        meta: postContent.meta,
        link: `/blog/${path.basename(k.replace('./', ''), '.mdx')}`
      }
    }))
  })(require.context('./', true, /\.mdx/))

  return {
    articles
  }
}

export default Blog
