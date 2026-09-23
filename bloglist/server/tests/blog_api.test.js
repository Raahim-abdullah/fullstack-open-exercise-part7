const { after, test, beforeEach, describe } = require("node:test")
const mongoose = require("mongoose")
const superTest = require("supertest")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const app = require("../app")
const Blog = require("../models/blog")
const User = require("../models/user")
const assert = require("node:assert")
const helper = require("./test_helper")

const api = superTest(app)

describe("when there is initially some blogs", () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash("secret", 10)
    const user = new User({ username: "root", passwordHash })
    await user.save()
    const initialUsers = await helper.usersInDb()

    const initialBlogs = [{
      "title": "My New Blog Post",
      "author": "Jane Doe",
      "url": "http://example.com/my-new-blog-post",
      "likes": 0,
      user: initialUsers[0].id
    },
    {
      "title": "My New Blog Post",
      "author": "Jane Doe",
      "url": "http://example.com/my-new-blog-post",
      "likes": 0,
      user: initialUsers[0].id
    }]
    await Blog.insertMany(initialBlogs)
  })

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("all blogs are returned", async () => {
    const res = await api.get("/api/blogs")

    assert.strictEqual(res.body.length, helper.initialBlogs.length)
  })

  test("blog id is named id not _id", async () => {
    const res = await api.get("/api/blogs")
    assert(Object.keys(res.body[0]).includes("id"))
  })



  describe("addition of blogs", () => {
    test("succeeds with statuscode 201", async () => {
      const newBlog = {
        "title": "My Old Blog Post",
        "author": "Jane Doe",
        "url": "http://example.com/my-old-blog-post",
        "likes": 7
      }

      const users = await helper.usersInDb()
      const user = await User.findById(users[0].id)
      const token = jwt.sign({ username: user.username, id: user.id }, process.env.SECRET)
      await api
        .post("/api/blogs")
        .send(newBlog)
        .set("Authorization", `Bearer ${token}`)
        .expect(201)
        .expect("Content-Type", /application\/json/)

      const res = await api.get("/api/blogs")
      assert.strictEqual(res.body.length, helper.initialBlogs.length + 1)
      const titles = res.body.map(r => r.title)
      assert(titles.includes("My Old Blog Post"))
    })


    test("fails with statuscode 400 if title is missing", async () => {
      const newBlog = {
        "author": "Jane Doe",
        "url": "http://example.com/my-old-blog-post",
        "likes": 7
      }

      const users = await helper.usersInDb()
      const user = await User.findById(users[0].id)
      const token = jwt.sign({ username: user.username, id: user.id }, process.env.SECRET)
      await api
        .post("/api/blogs")
        .send(newBlog)
        .set("Authorization", `Bearer ${token}`)
        .expect(400)

      const blogsAtEnd = await api.get("/api/blogs")

      assert.strictEqual(blogsAtEnd.body.length, helper.initialBlogs.length)
    })

    test("if likes field is missing. likes is set to 0", async () => {
      const newBlog = {
        "title": "My Old Blog Post",
        "author": "Jane Doe",
        "url": "http://example.com/my-old-blog-post",
      }

      const users = await helper.usersInDb()
      const user = await User.findById(users[0].id)
      const token = jwt.sign({ username: user.username, id: user.id }, process.env.SECRET)
      const response = await api
        .post("/api/blogs")
        .send(newBlog)
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /application\/json/)

      assert(response.body.likes === 0)
    })

    test("fails with statuscode 400 if url is missing", async () => {
      const newBlog = {
        "title": "My Old Blog Post",
        "author": "Jane Doe",
        "likes": 7
      }

      const users = await helper.usersInDb()
      const user = await User.findById(users[0].id)
      const token = jwt.sign({ username: user.username, id: user.id }, process.env.SECRET)
      await api
        .post("/api/blogs")
        .send(newBlog)
        .set("Authorization", `Bearer ${token}`)
        .expect(400)

      const blogsAtEnd = await api.get("/api/blogs")


      assert.strictEqual(blogsAtEnd.body.length, helper.initialBlogs.length)
    })

    test("falis if user token is not provided", async () => {
      const newBlog = {
        "title": "My Old Blog Post",
        "author": "Jane Doe",
        "url": "http://example.com/my-old-blog-post",
        "likes": 7
      }

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(401)
    })
  })

  describe("deletion of a blog", () => {
    test("succeeds with statuscode 204 if id is valid", async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      const users = await helper.usersInDb()
      const user = await User.findById(users[0].id)
      const token = jwt.sign({ username: user.username, id: user.id }, process.env.SECRET)
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map(b => b.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })
  describe("updating a blog", () => {
    test("updating likes by 10", async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = {
        ...blogsAtStart[0],
        "likes": blogsAtStart[0].likes + 10
      }

      const users = await helper.usersInDb()
      const user = await User.findById(users[0].id)
      const token = jwt.sign({ username: user.username, id: user.id }, process.env.SECRET)
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find(b => b.id == blogToUpdate.id)
      assert.deepStrictEqual(updatedBlog.likes, blogToUpdate.likes)
    })
  })
})

describe("when there is initially one user", () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const initialUsers = await helper.initialUsers()
    await User.insertMany(initialUsers)
  })

  describe("addition of a new users", () => {
    test("creation fails with proper statuscode and message if username is less then 3 characters", async () => {
      const userObject = {
        username: "12",
        name: "hello",
        password: "password"
      }

      await api.post("/api/users").send(userObject).expect(400).expect("Content-Type", /application\/json/)
    })

    test("creation fails with proper statuscode and message if username already taken", async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: "root",
        name: "Superuser",
        password: "salainen",
      }

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes("expected `username` to be unique"))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test("creation fails with proper statuscode and message if password is less then 3 characters", async () => {
      const userObject = {
        username: "hello, world!",
        name: "hello",
        password: "pas"
      }

      await api.post("/api/users").send(userObject).expect(400).expect("Content-Type", /application\/json/)

    })
  })

})

after(async () => {
  await mongoose.connection.close()
})
