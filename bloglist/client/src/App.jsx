import { useEffect } from "react"

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
} from "react-router-dom"
import { useState } from "react"

import Notification from "./components/Notification"
import LoginForm from "./components/LoginForm"
import BlogForm from "./components/BlogForm"
import Blog from "./components/Blog"
import BlogList from "./components/BlogList"
import ErrorBoundary from "./components/ErrorBoundary"
import NotFound from "./components/NotFound"
import ListUsers from "./components/ListUsers"
import User from "./components/User"

import { useBlogs, useBlogsAction, useUser, useLoginAction, useUserAction, useUsers } from "./store"

const App = () => {
  const blogs = useBlogs()
  const [isLoading, setIsLoading] = useState(true)
  const users = useUsers()
  const user = useUser()
  const { initialize } = useBlogsAction()
  const { initialUser, logout } = useLoginAction()
  const { getUsers } = useUserAction()

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([initialize(), initialUser(), getUsers()])
      setIsLoading(false)
    }

    loadData()
  }, [initialize, initialUser, getUsers])


  const matchBlog = useMatch("/blogs/:id")
  const blog = matchBlog
    ? blogs.find(blog => blog.id === matchBlog.params.id)
    : null

  const matchUser = useMatch("/users/:id")
  const selectedUser = matchUser
    ? users.find(u => u.id === matchUser.params.id)
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
              blogs
            </Button>
            <Button color="inherit" component={Link} to="/users" sx={style}>
              users
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
                <Button color="inherit" sx={style} onClick={logout}>
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
            <Blog blog={blog} user={user} isLoading={isLoading} />
          }
          />
          <Route path="/create" element={
            <BlogForm />
          }
          />
          <Route path="/login" element={
            <LoginForm />
          } />

          <Route path="/users" element={
            <ListUsers />
          } />

          <Route path="/users/:id" element={
            <User
              user={selectedUser} />
          } />

          <Route path="*" element={
            <NotFound
            />
          } />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
