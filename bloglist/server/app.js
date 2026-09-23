const express = require('express')
const mongoose = require('mongoose')
const blogRouter = require('./conntrollers/blogs')
const userRouter = require('./conntrollers/users')
const loginRouter = require("./conntrollers/login")
const middleware = require('./utils/middleware')
const { MONGODB_URI } = require('./utils/config')
const path = require('path')

const app = express()

mongoose.connect(MONGODB_URI, { family: 4 })

app.use(express.json())
app.use(middleware.tokenExtractor)

app.use("/api/blogs", blogRouter)
app.use("/api/users", userRouter)
app.use("/api/login", loginRouter)

// server build for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "../client/dist")))
  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"))
  })
}


// for testing
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require("./conntrollers/testing")
  app.use("/api/testing", testingRouter)
}

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app
