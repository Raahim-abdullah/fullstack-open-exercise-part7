import {
  Card,
  CardContent,
  Typography,
  Button,
  Link,
  Box
} from "@mui/material"

import { useNavigate } from "react-router-dom"
import { useBlogsAction } from "../store"

const Blog = ({ blog, user }) => {

  const { like, remove } = useBlogsAction()
  const navigate = useNavigate()

  const handleLike = () => {
    const newBlog = { ...blog, likes: blog.likes + 1 }
    like(newBlog)
  }

  const ifUserIsOwner = () => {
    return user.id === blog.user.id
  }

  if (!blog) return <Typography>Loading...</Typography>
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {blog.author}: {blog.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Added by {blog.username}
        </Typography>

        <Link
          href={blog.url}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
        >
          {blog.url}
        </Link>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 2
          }}
        >
          <Typography>
            Likes: {blog.likes}
          </Typography>

          {user && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleLike}
            >
              Like
            </Button>
          )}
          {user && ifUserIsOwner() && (
            <Button
              color="error"
              variant="outlined"
              size="small"
              onClick={() => {
                remove(blog)
                navigate("/")
              }}
            >
              Remove
            </Button>
          )}
        </Box>

      </CardContent>
    </Card>
  )
}

export default Blog
