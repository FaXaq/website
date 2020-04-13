import React from 'react'
import Link from 'next/link'

const Home = () => {
  return (
    <div>
      <ul>
        <li>
          <Link href="/resume">
            <a>Resume</a>
          </Link>
        </li>
        <li>
          <Link href="/mtts">
            <a>MTTS</a>
          </Link>
        </li>
        <li>
          <Link href="/blog">
            <a>Blog</a>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Home
