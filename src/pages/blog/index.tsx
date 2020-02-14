import fetch from 'isomorphic-unfetch';
import { NextPage } from 'next';
import Link from 'next/link'

interface BlogProps {
  articles: any[]
}

const Blog: NextPage<BlogProps> = function(props) {
  const links = props.articles.map(a => {
    return <Link href={`/blog/${a}`} key={`article-${a}`}>
      <a>{a}</a>
    </Link>
  })
  return <div className="font-sans">
    {links}
  </div>
}

Blog.getInitialProps = async (ctx) => {
  const res = await fetch(`http://${ctx.req.headers.host}/api/blog/articles`)
  const { articles } = await res.json()
  return {
    articles
  }
}


export default Blog;