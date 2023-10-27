import React from 'react'
import BlogHomePage from './components/HomePage'

interface BlogProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

async function Blog({ searchParams }: BlogProps) {
  const tagsInSearchParams = searchParams.tag
  const tags = []

  if (tagsInSearchParams instanceof Array) {
    tags.push(...tagsInSearchParams.sort())
  } else if (tagsInSearchParams) {
    tags.push(tagsInSearchParams)
  }

  /**
   * retrieve articles
   */
  const articles = await (async context => {
    // Only retrieve those that are in this directory
    const articlesPaths = context.keys().filter(path => path.startsWith('./'))

    return await Promise.all(articlesPaths.map(async (articlePath) => {
      const postContent = await import(`./${articlePath.replace('./', '')}`)
      return {
        meta: postContent.meta,
        link: `/blog/${articlePath.replace('./', '').substring(0, articlePath.lastIndexOf('/') - 1)}`
      }
    }))
  })(require.context('./', true, /\.mdx/))

  /**
   * remove articles that :
   * - Are not published (except for query param notPublished)
   * - Don't have the tags in query params
   */
  const filteredArticles = articles
    .filter(article => article.meta.published || searchParams.notPublished !== undefined)
    .filter(article => tags.every(tag => article.meta.tags.includes(tag)))
    .sort((article1, article2) =>
      new Date(article2.meta.creationDate).valueOf() - new Date(article1.meta.creationDate).valueOf()
    )

  return <BlogHomePage articles={filteredArticles} tags={tags} />
}

export default Blog
