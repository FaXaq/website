'use client'

import React from 'react'
import Link from 'next/link'
import Tags from './Tags'
import { useTranslation } from 'react-i18next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Head from 'next/head'

export interface ArticleMetaData {
  title: string
  description: string
  creationDate: string
  tags: string[]
  published: boolean
}

interface Article {
  meta: ArticleMetaData
  link: string
}

interface BlogProps {
  articles: Article[]
  tags: string[]
}

function BlogHomePage({ articles, tags }: BlogProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  function removeTagFromQueryParams (tagToRemove: string) {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    const tags = searchParams.getAll('tag')

    if (tags.length > 1) {
      newSearchParams.delete('tag')
      tags.filter(tag => tag !== tagToRemove).forEach(tag => newSearchParams.append('tag', tag))
    } else {
      if (tags.indexOf(tagToRemove) > -1) {
        newSearchParams.delete('tag')
      }
    }

    router.push(pathname + '?' + newSearchParams.toString())
  }

  function addTagToQueryParams (tag: string) {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    const tags = searchParams.getAll('tag')

    if (tags.indexOf(tag) === -1) {
      newSearchParams.append('tag', tag)
    } else {
      return
    }

    router.push(pathname + '?' + new URLSearchParams(newSearchParams).toString())
  }

  const links = articles.map((a, i) => {
    return (
      <li key={`article-${i}`} className="mt-2">
        <Link href={`${a.link}`}>
          <div>
            <h3 className="font-mtts-title font-semibold text-2xl my-2">{a.meta.title}</h3>
            <p className="text-sm text-opacity-25">{a.meta.description ? a.meta.description : '' } - <em>{t('format.date', { date: new Date(a.meta.creationDate) })}</em></p>
          </div>
        </Link>
        <Tags tags={a.meta.tags || []} onClick={addTagToQueryParams} />
      </li>
    )
  })

  return (
    <>
      <Head>
        <title>Blog</title>
      </Head>
      <div className="font-sans container mx-auto px-4">
        <header>
          <h1 className="text-8xl font-bold font-mtts-title">{t('blog.title')}</h1>
          <section>
            {tags.length > 0 && (
              <div>
                <p>{t('blog.tagsSearch')}</p>
                <ul>
                  <Tags tags={tags} removable onDelete={tag => removeTagFromQueryParams(tag)}/>
                </ul>
              </div>
            )}
          </section>
        </header>
        <article>
          <ul className="flex flex-col">
            {links.length > 0 ? links : 'No blog post here...'}
          </ul>
        </article>
      </div>
    </>
  )
}

export default BlogHomePage
