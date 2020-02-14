import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const files = fs.readdirSync(`./${process.env.NODE_ENV === "production" ? "" : "public/"}/articles`)
  res.send({ articles: files })
}