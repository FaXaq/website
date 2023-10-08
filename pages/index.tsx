import React from 'react'
import Link from 'next/link'

const Home = () => {
  return (
    <div>
      <ul>
        <li>
          <Link href="/resume">
            Resume
          </Link>
        </li>
        <li>
          <Link href="/projects">
            Projects
          </Link>
        </li>
        <li>
          <Link href="/blog">
            Blog
          </Link>
        </li>
        <li>
          <Link target="_blank" href="https://github.com/faxaq">
            Github
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Home
