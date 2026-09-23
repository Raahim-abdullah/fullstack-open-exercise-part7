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

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const [notification, setNotification] = useState({
    message: null,
    type: "error"
  })

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
      setNotification({
        message: `${username} is logged in.`,
        type: "success"
      })
      setUsername("")
      setPassword("")
      setTimeout(() => {
        setNotification({ ...notification, message: null })
      }, 3000)
    } catch (error) {
      console.error(error.response.data.error)
      setNotification({
        message: error.response.data.error,
        type: "error"
      })
      setTimeout(() => {
        setNotification({ ...notification, message: null })
      }, 3000)

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
      setNotification({
        message: `a new blog ${newBlog.title} by ${newBlog.author} added.`,
        type: "success"
      })
      setTimeout(() => {
        setNotification({ ...notification, message: null })
      }, 3000)
    } catch (error) {
      setNotification({
        message: error.response.data.error,
        type: "error"
      })
      setTimeout(() => {
        setNotification({ ...notification, message: null })
      }, 3000)
    }
  }

  const handleLike = async (newBlog) => {
    try {
      const updatedBlog = await blogService.update(newBlog)
      setBlogs(blogs.map(blog => blog.id === newBlog.id ? { ...blog, likes: updatedBlog.likes } : blog).sort((a, b) => b.likes - a.likes))
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemove = async (blog) => {
    try {
      await blogService.deleteBlog(blog)
      setBlogs(blogs.filter(b => b.id !== blog.id).sort((a, b) => b.likes - a.likes))
      setNotification({
        message: `you have deleted ${blog.title} by ${blog.author}.`,
        type: "success"
      })
      setTimeout(() => {
        setNotification({ message: null, type: "error" })
      }, 3000)
    } catch (error) {
      setNotification({
        message: error.response.data.error,
        type: "error"
      })
      setTimeout(() => {
        setNotification({ ...notification, message: null })
      }, 3000)

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
      <Notification message={notification.message} type={notification.type} />
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
