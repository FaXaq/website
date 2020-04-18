import React from 'react'
// eslint-disable-next-line no-unused-vars
import { NextPage } from 'next'
import Link from 'next/link'
import path from 'path'
import { useTranslation } from 'react-i18next'

import '../../styles/blog.scss'
import matter from 'gray-matter'

interface Article {
  data: { [key: string] : any }
  link: string
}

interface BlogProps {
  articles: Article[];
}

const Blog: NextPage<BlogProps> = function ({ articles }: BlogProps) {
  const { t } = useTranslation()

  const links = articles.map((a, i) => {
    const articleDate = new Date(a.data.creationDate)
    return (
      <li key={`article-${i}`}>
        <Link href={`/blog/${a.link}`}>
          <a>{a.data.title} {t('format.date', { date: articleDate })}</a>
        </Link>
      </li>
    )
  })
  return (
    <div className="font-sans">
      <h1 className="text-2xl">{t('blog.title')}</h1>
      <ul className="flex flex-col">
        {links.length > 0 ? links : 'No blog post yet...'}
      </ul>
    </div>
  )
}

Blog.getInitialProps = async (_) => {
  const articles = await (async context => {
    return await Promise.all(context.keys().map(async (k) => {
      const postContent = await import(`../../public/articles/${k.replace('./', '')}`)
      const { data } = matter(postContent.default)
      return {
        data,
        link: `/blog/${path.basename(k.replace('./', ''), '.md')}`
      }
    }))
  })(require.context('../../public/articles', true, /\.md/))

  return {
    articles
  }
}

export default Blog
