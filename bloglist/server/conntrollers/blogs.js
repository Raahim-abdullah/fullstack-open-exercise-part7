const blogRouter = require("express").Router()
const middleware = require("../utils/middleware")
const Blog = require("../models/blog")
const User = require("../models/user")
const Comment = require("../models/comment")


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user", { username: 1, name: 1 })
  response.json(blog)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  if (!user) {
    return response.status(400).json({ error: `userId is missing or not valid` })
  }

  if (!body.title || !body.url) {
    return response.status(400).json({
      error: "title or url missing"
    })
  }

  const newBlog = new Blog({
    title: body.title,
    author: body.author || "",
    url: body.url,
    likes: body.likes || 0,
    user: user
  })

  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete("/:id", middleware.userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)
  console.log(blog)
  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: "you are not the user who created this blog" })
  }
  await blog.deleteOne()
  response.status(204).end()
})

blogRouter.put("/:id", middleware.userExtractor, async (request, response) => {
  console.time("update")

  const user = await User.findById(request.user)

  if (!user) {
    return response.status(400).json({ error: `userId is missing or not valid` })
  }

  console.timeLog("update", "user found")
  const blog = await Blog.findById(request.params.id)
  console.timeLog("update", "blog found")
  if (!blog) {
    return response.status(404).end()
  }

  blog.likes = request.body.likes
  blog.title = request.body.title
  const updateBlog = await blog.save()
  console.timeLog("update", "saved")
  console.timeEnd("update")
  return response.json(updateBlog)
})

blogRouter.get("/:id/comments", async (request, response) => {
  const comments = await Comment.find({ blog: request.params.id })
  return response.json(comments)
})

blogRouter.post("/:id/comments", middleware.requestLogger, async (request, response) => {
  const body = request.body

  if (!body.comment) {
    return response.status(400).json({
      error: "comment missing"
    })
  }

  const comment = new Comment({
    comment: body.comment,
    blog: request.params.id
  })
  const newComment = await comment.save()
  return response.json(newComment)
})

module.exports = blogRouter
