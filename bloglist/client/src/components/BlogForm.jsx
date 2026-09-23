import { TextField, Button } from "@mui/material"
import { useState } from "react"

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    await addBlog({
      title,
      author,
      url,
      likes: 0
    })
    setTitle("")
    setAuthor("")
    setUrl("")

  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            required
          />
        </div>
        <div>
          <TextField
            label="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            required
          />
        </div>
        <div>
          <TextField
            label="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            required
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>create</Button>
      </form>
    </div>
  )
}

export default BlogForm
