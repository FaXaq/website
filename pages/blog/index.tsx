import React from 'react'
// eslint-disable-next-line no-unused-vars
import { NextPage } from 'next'
import Link from 'next/link'
import path from 'path'
import { useTranslation } from 'react-i18next'
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
      <li key={`article-${i}`} className="my-4">
        <Link href={`${a.link}`}>
          <a>
            <div>
              <h3 className="font-mtts-title font-semibold text-2xl my-2">{a.data.title}</h3>
              <p>{a.data.description ? a.data.description : '' } - <em>{t('format.date', { date: articleDate })}</em></p>
            </div>
          </a>
        </Link>
      </li>
    )
  })
  return (
    <div className="font-sans container mx-auto">
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
