import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"

const blogPostSchema = {
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and needs to be a String."
    }
  },
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is a mandatory field and needs to be a String."
    }
  },
  cover: {
    in: ["body"],
    isString: {
      errorMessage:
        "Cover is a mandatory field. Please supply a URL to an image."
    }
  },
  readTime: {
    value: {
      in: ["body.readTime"],
      isInt: {
        errorMessage: "value is a mandatory field and needs to be a number."
      }
    },
    unit: {
      in: ["body.readTime"],
      isString: {
        errorMessage: "Unit is a mandatory field and needs to be a String."
      }
    }
  },
  author: {
    name: {
      in: ["body.author"],
      isString: {
        errorMessage:
          "Author name is a mandatory field and needs to be a String."
      }
    }
  },
  content: {
    in: ["body"],
    isString: { errorMessage: "Please supply valid post content." }
  }
}

export const checksPostSchema = checkSchema(blogPostSchema)

export const triggerBadRequest = (req, res, next) => {
  // 1. Check if previous middleware ( checksBlogPostsSchema) has detected any error in req.body
  const errors = validationResult(req)

  console.log(errors.array())

  if (!errors.isEmpty()) {
    // 2.1 If we have any error --> trigger error handler 400
    next(
      createHttpError(400, "Errors during blogPost validation", {
        errorsList: errors.array()
      })
    )
  } else {
    // 2.2 Else (no errors) --> normal flow (next)
    next()
  }
}

// VALIDATION CHAIN 1. checksBlogPostsSchema --> 2. triggerBadRequest
