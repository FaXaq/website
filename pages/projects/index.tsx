import React from 'react'
import Link from 'next/link'

const Projects = () => {
  return <ul>
    <li>
      <Link href="/projects/mtts">
        MTTS
      </Link>
    </li>
    <li>
      <Link href="/projects/corsica">
        Corsica
      </Link>
    </li>
  </ul>
}

export default Projects
