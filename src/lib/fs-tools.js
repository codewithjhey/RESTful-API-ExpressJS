import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs-extra"

const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const publicFolderPath = join(process.cwd(), "./public/img/authors")

console.log("ROOT OF THE PROJECT:", process.cwd())
console.log("PUBLIC FOLDER:", publicFolderPath)

console.log("DATA FOLDER PATH: ", dataFolderPath)
const blogPostsJSONPath = join(dataFolderPath, "blogPosts.json")
const authorsJSONPath = join(dataFolderPath, "authors.json")

export const getBlogPosts = () => readJSON(blogPostsJSONPath)
export const writeBlogPosts = (blogPostsArray) =>
  writeJSON(blogPostsJSONPath, blogPostsArray)

export const getAuthors = () => readJSON(authorsJSONPath)
export const writeAuthors = (authorsArray) =>
  writeJSON(authorsJSONPath, authorsArray)

export const saveAuthorsAvatars = (fileName, contentAsABuffer) =>
  writeFile(join(publicFolderPath, fileName), contentAsABuffer)
