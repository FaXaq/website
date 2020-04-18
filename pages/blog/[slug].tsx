import React from 'react'
// eslint-disable-next-line no-unused-vars
import { NextPage } from 'next'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

import '../../styles/blog.scss'

interface ArticleProps {
  content: string;
  data: {
    title?: string;
    author?: string;
    data?: string;
  };
}

const Article: NextPage<ArticleProps> = (props: ArticleProps) => {
  const renderedArticle = new MarkdownIt().render(props.content)
  return (
    <div>
      <h1>
        {props.data.title
          ? props.data.title
          : 'Oops, this article has no title.'}
      </h1>
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
