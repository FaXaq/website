import { NextPage } from 'next'
import fetch from 'isomorphic-unfetch'
import MarkdownIt from 'markdown-it'

interface ArticleProps {
  content: string,
  title: string
}

const Article: NextPage<ArticleProps> = (props: ArticleProps) => {
  const renderedArticle = (new MarkdownIt()).render(props.content)
  return <div dangerouslySetInnerHTML={ { __html: renderedArticle } }>
  </div>
}

Article.getInitialProps = async (ctx) => {
  const res = await fetch(`http://${ctx.req.headers.host}/api/blog/article/${ctx.query.articleName}`)
  const { content, title } = await res.json()
  return { content, title }
}

export default Article;