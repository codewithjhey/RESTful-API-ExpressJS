import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./api/authors/index.js"
import blogPostsRouter from "./api/blogPost/index.js"
import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHandler,
  unauthorizedHandler
} from "./errorHandlers.js"

const server = express()

const port = 3001

server.use(cors())

server.use(express.json())

server.use("/authors", authorsRouter)
server.use("/blogPosts", blogPostsRouter)

server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log("server is running on port:", port)
})
