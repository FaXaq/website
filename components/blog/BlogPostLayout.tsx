import React, { useEffect } from 'react'
import Prism from 'prismjs'
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
    <div className="article container md:max-w-1/2">
      <h1>{meta.title}</h1>
      <div className="article-info">
        <p>{meta.description ? meta.description : '' } - <em>{t('format.date', { date: new Date(meta.creationDate) })}</em></p>
      </div>
      {children}
    </div>
  )
}

export default BlogPostLayout
