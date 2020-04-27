import React, { useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { NextPage } from 'next'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import { useTranslation } from 'react-i18next'
import Prism from 'prismjs'

interface ArticleProps {
  content: string;
  data: {
    title?: string;
    description?: string;
    author?: string;
    creationDate?: string;
  };
}

const Article: NextPage<ArticleProps> = ({ data, content }: ArticleProps) => {
  const renderedArticle = new MarkdownIt().render(content)
  const { t } = useTranslation()

  useEffect(() => {
    Prism.highlightAll()
  }, [])

  return (
    <div className="article container">
      <h1>{data.title}</h1>
      <div className="article-info">
        <p>{data.description ? data.description : '' } - <em>{t('format.date', { date: data.creationDate })}</em></p>
      </div>
      <div dangerouslySetInnerHTML={{ __html: renderedArticle }}></div>
    </div>
  )
}

Article.getInitialProps = async ctx => {
  const { slug } = ctx.query
  const postContent = await import(`../../public/articles/${slug}.md`)
  const { data, content } = matter(postContent.default)
  return { content, data }
}

export default Article
