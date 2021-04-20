import React, { useEffect } from 'react'
import Prism from 'prismjs'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'

interface BlogPostLayoutProps {
  children: JSX.Element | JSX.Element[]
  meta: {
    title: string,
    creationDate: string,
    description: string
  }
}

const BlogPostLayout = ({ children, meta }: BlogPostLayoutProps) => {
  const { t } = useTranslation()
  useEffect(() => {
    Prism.highlightAll()
  }, [])

  return (
    <>
      <Head>
        <title>{meta.title}</title>
      </Head>
      <div className="article container md:max-w-1/2">
        <header>
          <h1>{meta.title}</h1>
          <div className="article-info text-sm text-opacity-25">
            <p>{meta.description ? meta.description : '' } - <em>{t('format.date', { date: new Date(meta.creationDate) })}</em></p>
          </div>
        </header>
        <article className="content">
          {children}
        </article>
      </div>
    </>
  )
}

export default BlogPostLayout
