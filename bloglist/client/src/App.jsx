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

import Notification from "./components/Notification"
import LoginForm from "./components/LoginForm"
import BlogForm from "./components/BlogForm"
import Blog from "./components/Blog"
import BlogList from "./components/BlogList"
import ErrorBoundary from "./components/ErrorBoundary"
import NotFound from "./components/NotFound"

import { useBlogs, useBlogsAction, useUser, useUserAction } from "./store"

const App = () => {
  const blogs = useBlogs()
  const user = useUser()
  const { initialize } = useBlogsAction()
  const { initialUser, logout } = useUserAction()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    initialUser()
  }, [initialUser])

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
            <Blog
              blog={blog}
              user={user}
            />
          } />
          <Route path="/create" element={
            <BlogForm />
          }
          />
          <Route path="/login" element={
            <LoginForm />
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
