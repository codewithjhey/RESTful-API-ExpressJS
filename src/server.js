import express from "express"
import cors from "cors"
import createHttpError from "http-errors"
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./api/authors/index.js"
import blogPostsRouter from "./api/blogPost/index.js"
import filesRouter from "./api/files/index.js"
import { join } from "path"

import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHandler,
  unauthorizedHandler
} from "./errorHandlers.js"

const server = express()

const port = process.env.PORT

const publicFolderPath = join(process.cwd(), "./public")

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]

const corsOpts = {
  origin: (origin, corsNext) => {
    console.log("CURRENT ORIGIN: ", origin)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      // If current origin is in the whitelist you can move on
      corsNext(null, true)
    } else {
      // If it is not --> error
      corsNext(
        createHttpError(400, `Origin ${origin} is not in the whitelist!`)
      )
    }
  }
}

server.use(express.static(publicFolderPath))
server.use(cors(corsOpts))

server.use(express.json())

server.use("/authors", authorsRouter)
server.use("/blogPosts", blogPostsRouter)
server.use("/files", filesRouter)

server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log("server is running on port:", port)
})
