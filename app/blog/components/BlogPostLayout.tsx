'use client'

import React, { useEffect } from 'react'
import Prism from 'prismjs'
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-rust";
import "prismjs/themes/prism.css";
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { format } from 'date-fns'

interface BlogPostLayoutProps {
  children: React.JSX.Element | React.JSX.Element[]
  meta: {
    title: string,
    creationDate: string,
    description: string
  }}

const BlogPostLayout = ({ children, meta }: BlogPostLayoutProps) => {
  const { t } = useTranslation()
  useEffect(() => {
    Prism.highlightAll()
  }, [])

  if (!meta) {
    return
  }

  return (
    <>
      <Head>
        <title>{meta.title}</title>
      </Head>
      <div className="article container md:max-w-1/2">
        <header>
          <div className="flex items-center">
            <a className="font-bold" href="/blog" aria-label="Go back to blog home">←</a>
            <h1>{meta.title}</h1>
          </div>
          <div className="article-info text-sm text-opacity-25">
            <p>{meta.description ? meta.description : '' } - <em>{format(new Date(meta.creationDate), 'do MMMM yyyy')}</em></p>
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
