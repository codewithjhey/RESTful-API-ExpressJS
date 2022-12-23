import express from "express"
import multer from "multer"
import { extname } from "path"
import {
  saveAuthorsAvatars,
  getAuthors,
  writeAuthors
} from "../../lib/fs-tools.js"

const filesRouter = express.Router()

filesRouter.post(
  "/:authorId/single",
  multer().single("avatar"),
  async (req, res, next) => {
    try {
      const originalFileExtension = extname(req.file.originalname)
      const fileName = req.params.authorId + originalFileExtension

      await saveAuthorsAvatars(fileName, req.file.buffer)

      const url = `http://localhost:3001/img/authors/${fileName}`

      const authors = await getAuthors()

      const index = authors.findIndex(
        (author) => author.id === req.params.authorId
      )
      if (index !== -1) {
        const oldAuthor = authors[index]

        const author = { ...oldAuthor.author, avatar: url }
        const updatedAuthor = { ...oldAuthor, author, updatedAt: new Date() }

        authors[index] = updatedAuthor

        await writeAuthors(authors)
      }
      res.send("File uploaded")
    } catch (error) {
      next(error)
    }
  }
)

export default filesRouter
