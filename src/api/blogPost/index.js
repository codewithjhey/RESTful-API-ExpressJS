import express from "express"
import uniqid from "uniqid"
import httpErrors from "http-errors"
import { checksPostSchema, triggerBadRequest } from "./validator.js"
import { getBlogPosts, writeBlogPosts } from "../../lib/fs-tools.js"

const { NotFound } = httpErrors

const blogPostsRouter = express.Router()

blogPostsRouter.post(
  "/",
  checksPostSchema,
  triggerBadRequest,

  async (req, res, next) => {
    const newPost = { ...req.body, createdAt: new Date(), _id: uniqid() }
    try {
      const blogPostsArray = await getBlogPosts()

      blogPostsArray.push(newPost)

      await writeBlogPosts(blogPostsArray)

      res.status(201).send({ _id: newPost._id })
    } catch (error) {
      next(error)
    }
  }
)

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPostsArray = await getBlogPosts()
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

blogPostsRouter.get("/:postId", async (req, res, next) => {
  try {
    const posts = await getBlogPosts()
    const post = posts.find((post) => post._id === req.params.postId)
    if (post) {
      res.send(post)
    } else {
      next(NotFound(`Post with the id ${req.params.postId} not found`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.put("/:postId", async (req, res, next) => {
  try {
    const posts = await getBlogPosts()

    const index = books.findIndex((post) => post._id === req.params.postId)
    if (index !== -1) {
      const oldPost = posts[index]

      const updatedPost = { ...oldPost, ...req.body, updatedAt: new Date() }

      posts[index] = updatedPost

      await writeBlogPosts(posts)

      res.send(updatedPost)
    } else {
      next(NotFound(`Post with is ${req.params.postId} cannot be found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.delete("/:postId", async (req, res, next) => {
  try {
    const posts = await getBlogPosts()

    const remainingPosts = posts.filter((post) => post._id != req.params.postId)

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
