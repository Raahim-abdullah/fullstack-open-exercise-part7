import { useState, useEffect } from "react"
import blogService from "./services/blogs"
import loginService from "./services/login"

import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button
} from "@mui/material"

import {
  Routes,
  Route,
  Link,
  useMatch,
  useNavigate
} from "react-router-dom"

import Notification from "./components/Notification"
import LoginForm from "./components/LoginForm"
import BlogForm from "./components/BlogForm"
import Blog from "./components/Blog"
import BlogList from "./components/BlogList"
import ErrorBoundary from "./components/ErrorBoundary"
import NotFound from "./components/NotFound"

import { useNotificationAction } from "./store"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { setNotification } = useNotificationAction()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem("loggedBlogAppUser")
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      navigate("/")
      setNotification(
        `${username} is logged in.`,
        "success"
      )
      setUsername("")
      setPassword("")
    } catch (error) {
      console.error(error.response.data.error)
      setNotification(
        error.response.data.error,
        "error")
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = async (newBlog) => {
    try {
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes))
      navigate("/")
      setNotification(
        `a new blog ${newBlog.title} by ${newBlog.author} added.`,
        "success"
      )
    } catch (error) {
      setNotification(
        error.response.data.error,
        "error"
      )
    }
  }

  const handleLike = async (newBlog) => {
    try {
      const updatedBlog = await blogService.update(newBlog)
      setBlogs(blogs.map(blog => blog.id === newBlog.id ? { ...blog, likes: updatedBlog.likes } : blog).sort((a, b) => b.likes - a.likes))
    } catch (error) {
      setNotification(
        error.response.data.error,
        "error"
      )
    }
  }

  const handleRemove = async (blog) => {
    try {
      await blogService.deleteBlog(blog)
      setBlogs(blogs.filter(b => b.id !== blog.id).sort((a, b) => b.likes - a.likes))
      setNotification(
        `you have deleted ${blog.title} by ${blog.author}.`,
        "success"
      )
    } catch (error) {
      setNotification(
        error.response.data.error,
        "error"
      )
    }
  }

  const match = useMatch("/blogs/:id")

  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  const style = {
    "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
  }

  return (
    <Container>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Blog List
            </Typography>
            <Button color="inherit" component={Link} to="/" sx={style}>
              Blogs
            </Button>
            {!user
              ?
              <Button color="inherit" component={Link} to="/login" sx={style}>
                login
              </Button>
              :
              <>
                <Button color="inherit" component={Link} to="/create" sx={style}>
                  new blog
                </Button>
                <Button color="inherit" sx={style} onClick={handleLogout}>
                  logout
                </Button>
              </>
            }
          </Toolbar>
        </AppBar>
      </Box>
      <Notification />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={
            <BlogList blogs={blogs} />
          } />
          <Route path="/blogs/:id" element={
            <Blog
              blog={blog}
              user={user}
              like={handleLike}
              remove={handleRemove}
            />
          } />
          <Route path="/create" element={
            <BlogForm
              addBlog={addBlog}
            />
          }
          />
          <Route path="/login" element={
            <LoginForm
              handleSubmit={handleLogin}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
            />
          } />

          <Route path="*" element={
            <NotFound />
          } />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
