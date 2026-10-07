import {
  Card,
  CardContent,
  Typography,
  Button,
  Link,
  Box,
  TextField
} from "@mui/material"

import { useNavigate } from "react-router-dom"
import { useBlogsAction } from "../store"
import { useEffect, useState } from "react"

const Blog = ({ blog, user }) => {
  const { like, remove, getBlogComments, addComment } = useBlogsAction()
  const navigate = useNavigate()
  const [comments, setCommets] = useState([])
  const [comment, setCommet] = useState("")

  useEffect(() => {
    if (blog) {
      const fetchComments = async () => {
        const comments = await getBlogComments(blog.id)
        setCommets(comments)
      }

      fetchComments()
    }
  }, [blog, getBlogComments])

  const handleLike = () => {
    const newBlog = { ...blog, likes: blog.likes + 1 }
    like(newBlog)
  }

  const ifUserIsOwner = () => {
    return user.id === blog.user.id
  }

  const handleComment = async (e) => {
    e.preventDefault()
    const newComment = await addComment(blog.id, comment)
    setCommets(comments.concat(newComment))
    setCommet("")
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

        <Box
          sx={{
            alignItems: "center",
            gap: 1,
            mt: 2
          }}
        >
          <Typography variant="h5">Comments</Typography>
          <Box component="form" sx={{ display: "flex", width: 400 }} onSubmit={handleComment}>
            <TextField
              label="comment"
              value={comment}
              onChange={({ target }) => setCommet(target.value)}
              sx={{ flexGrow: 1 }}
              required
            />
            <Button variant="contained">Add Comment</Button>
          </Box>
          {comments.length === 0
            ? <Typography variant="caption">no comments made yat.</Typography>
            : <ul>
              {comments.map(comment => <li key={comment.id}>{comment.comment}</li>)}
            </ul>}
        </Box>

      </CardContent>
    </Card>
  )
}

export default Blog
