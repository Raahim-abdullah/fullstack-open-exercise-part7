import { useNavigate } from "react-router-dom"
import { useField } from '../hooks/index'

const CreateNew = ({ addNew }) => {
  const { value: content, onChange: setContent } = useField("text")
  const { value: author, onChange: setAuthor } = useField("text")
  const { value: info, onChange: setInfo } = useField("text")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    addNew({ content, author, info, votes: 0 })
    navigate("/")
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input
            name="content"
            value={content}
            onChange={(e) => setContent(e)}
          />
        </div>
        <div>
          author
          <input
            name="author"
            value={author}
            onChange={(e) => setAuthor(e)}
          />
        </div>
        <div>
          url for more info
          <input
            name="info"
            value={info}
            onChange={(e) => setInfo(e)}
          />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default CreateNew
