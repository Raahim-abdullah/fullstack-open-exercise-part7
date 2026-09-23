const bcrypt = require("bcrypt")
const User = require("../models/user")
const Blog = require("../models/blog")

const initialBlogs = [{
  "title": "My New Blog Post",
  "author": "Jane Doe",
  "url": "http://example.com/my-new-blog-post",
  "likes": 0
},
{
  "title": "My New Blog Post",
  "author": "Jane Doe",
  "url": "http://example.com/my-new-blog-post",
  "likes": 0
}]

const initialUsers = async () => ([
  {
    username: "root",
    name: "rootuser",
    passwordHash: await bcrypt.hash("password", 10)
  },
])

const NoneExistingId = async () => {
  const blog = new Blog({
    "title": "My New Blog Post",
    "author": "Jane Doe",
    "url": "http://example.com/my-new-blog-post",
    "likes": 0
  })
  await blog.save()
  await blog.deleteOne()

  return blog.id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, NoneExistingId, blogsInDb, initialUsers, usersInDb
}
