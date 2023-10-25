'use client'

import React, { useEffect } from 'react'
import Prism from 'prismjs'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

interface BlogPostLayoutProps {
  children: React.JSX.Element | React.JSX.Element[]
  meta: {
    title: string,
    creationDate: string,
    description: string
  }}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

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
