import React from 'react'
// eslint-disable-next-line no-unused-vars
import { NextPage } from 'next'
import Link from 'next/link'
import path from 'path'
import Tags from '../../components/blog/Tags'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
// eslint-disable-next-line no-unused-vars
import { ParsedUrlQuery } from 'querystring'

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

function computeQueryToUrlSearchParams (query: ParsedUrlQuery): string[][] {
  const queryParams = []
  Object.keys(query).forEach(param => {
    const paramValue = query[param]
    if (paramValue instanceof Array) {
      paramValue.forEach(value => {
        queryParams.push([param, value])
      })
    } else {
      queryParams.push([param, paramValue])
    }
  })
  return queryParams
}

const Blog: NextPage<BlogProps> = function ({ articles, tags }: BlogProps) {
  const { t } = useTranslation()
  const router = useRouter()

  function removeTagFromQueryParams (tag: string) {
    const query = router.query

    /**
     * remove tag from query param
     */
    if (query.tag instanceof Array) {
      query.tag = query.tag.filter(queryTag => queryTag !== tag)
    } else {
      if (query.tag === tag) {
        delete query.tag
      }
    }

    const queryParams = computeQueryToUrlSearchParams(query)

    router.push(router.route + '?' + new URLSearchParams(queryParams).toString())
  }

  function addTagToQueryParams (tag: string) {
    const query = router.query

    /**
     * add tag to query params
     */
    if (query.tag) {
      if (query.tag instanceof Array) {
        if (query.tag.indexOf(tag) === -1) {
          query.tag.push(tag)
        } else {
          return
        }
      } else {
        query.tag = [
          query.tag,
          tag
        ]
      }
    } else {
      query.tag = [tag]
    }

    const queryParams = computeQueryToUrlSearchParams(query)

    router.push(router.route + '?' + new URLSearchParams(queryParams).toString())
  }

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
        <Tags tags={a.meta.tags || []} onClick={addTagToQueryParams} />
      </li>
    )
  })

  return (
    <div className="font-sans container mx-auto px-4">
      <header>
        <h1 className="text-8xl font-bold font-mtts-title">{t('blog.title')}</h1>
        {tags.length > 0 && (
          <div>
            <p>{t('blog.tagsSearch')}</p>
            <ul>
              <Tags tags={tags} removable onDelete={tag => removeTagFromQueryParams(tag)}/>
            </ul>
          </div>
        )}
      </header>
      <article>
        <ul className="flex flex-col">
          {links.length > 0 ? links : 'No blog post here...'}
        </ul>
      </article>
    </div>
  )
}

Blog.getInitialProps = async (context) => {
  /** retrieve tags to filter if necessary */
  // what is this ugly ternary
  const tags = context.query.tag
    ? context.query.tag instanceof Array
      ? [...context.query.tag]
      : [context.query.tag]
    : []
  /**
   * retrieve articles
   */
  const articles = await (async context => {
    return await Promise.all(context.keys().map(async (k) => {
      const postContent = await import(`./${k.replace('./', '')}`)
      return {
        meta: postContent.meta,
        link: `/blog/${path.basename(k.replace('./', ''), '.mdx')}`
      } as Article
    }))
  })(require.context('./', true, /\.mdx/))

  console.log(context.query)

  /**
   * remove articles that :
   * - Are not published (except for query param notPublished)
   * - Don't have the tags in query params
   */
  const filteredArticles = articles
    .filter(article => article.meta.published || context.query.notPublished !== undefined)
    .filter(article => tags.every(tag => article.meta.tags.includes(tag)))

  return {
    articles: filteredArticles,
    tags
  }
}

export default Blog
