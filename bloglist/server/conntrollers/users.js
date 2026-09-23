const usersRouter = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs")
  res.status(200).json(users)
})

usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body

  if (password.length < 4) {
    return res.status(400).json({ error: "password shuld be more then 3 char" })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

module.exports = usersRouter
