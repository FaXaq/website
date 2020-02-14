import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { articleName },
  } = req
  const content = fs.readFileSync(`./${process.env.NODE_ENV === "production" ? "" : "public/"}articles/${articleName}`).toString()
  res.send({ content })
}