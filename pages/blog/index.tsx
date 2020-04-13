import React from 'react'
// eslint-disable-next-line no-unused-vars
import { NextPage } from 'next'
import Link from 'next/link'
import path from 'path'
import { useTranslation } from 'react-i18next'

interface BlogProps {
  articles: any[];
}

const Blog: NextPage<BlogProps> = function ({ articles }: BlogProps) {
  const { t } = useTranslation()

  const links = articles.map((a, i) => {
    return (
      <div key={`article-${i}`}>
        <h1 className="text-2xl">{t('blog.title')}</h1>
        <Link href={`/blog/${a}`} key={`article-${a}`}>
          <a>{a}</a>
        </Link>
      </div>
    )
  })
  return <div className="font-sans">{links}</div>
}

Blog.getInitialProps = _ => {
  const articles = (context => {
    return context.keys().map(k => {
      return path.basename(k.replace('./', ''), '.md')
    })
  })(require.context('../../public/articles', true, /\.md/))

  return {
    articles
  }
}

export default Blog
