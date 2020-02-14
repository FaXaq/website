import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const files = fs.readdirSync("./src/assets/articles")
  res.send({ articles: files })
}