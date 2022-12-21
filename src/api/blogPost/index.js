import express from "express"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"
import fs from "fs"
import httpErrors from "http-errors"

const { NotFound } = httpErrors

const blogPostsRouter = express.Router()

const blogPostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
)

const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath))

const writeBlogPosts = (blogPostsArray) =>
  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPostsArray))

blogPostsRouter.post("/", (req, res, next) => {
  const newPost = { ...req.body, createdAt: new Date(), id: uniqid() }
  try {
    const blogPostsArray = getBlogPosts()

    blogPostsArray.push(newPost)

    writeBlogPosts(blogPostsArray)

    res.status(201).send({ id: newPost.id })
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.get("/", (req, res, next) => {
  try {
    const blogPostsArray = getBlogPosts()
    if (req.query && req.query.category) {
      const filteredPosts = blogPostsArray.filter(
        (post) => post.category === req.query.category
      )
      res.send(filteredPosts)
    } else {
      res.send(blogPostsArray)
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.get("/:postId", (req, res, next) => {
  try {
    const posts = getBlogPosts()
    const post = posts.find((post) => post.id === req.params.postId)
    if (post) {
      res.send(post)
    } else {
      next(NotFound(`Post with the id ${req.params.postId} not found`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.put("/:postId", (req, res, next) => {
  try {
    const posts = getBlogPosts()

    const index = books.findIndex((post) => post.id === req.params.postId)
    if (index !== -1) {
      const oldPost = posts[index]

      const updatedPost = { ...oldPost, ...req.body, updatedAt: new Date() }

      posts[index] = updatedPost

      writeBlogPosts(posts)

      res.send(updatedPost)
    } else {
      next(NotFound(`Post with is ${req.params.postId} cannot be found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.delete("/:postId", (req, res, next) => {
  try {
    const posts = getBlogPosts()

    const remainingPosts = posts.filter((post) => post.id != req.params.postId)

    if (posts.length !== remainingPosts.length) {
      writeBlogPosts(remainingPosts)
      res.status(204).send()
    } else {
      next(NotFound(`Post with the is ${req.params.postId} cannot be found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default blogPostsRouter
