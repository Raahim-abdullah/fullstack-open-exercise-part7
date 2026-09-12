import { useNavigate } from "react-router-dom"
import { useField } from '../hooks/index'

const CreateNew = ({ addNew }) => {
  const content = useField("text")
  const author = useField("text")
  const info = useField("text")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    addNew({ content: content.inputprops.value, author: author.inputprops.value, info: info.inputprops.value, votes: 0 })
    navigate("/")
  }


  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input
            {...content.inputprops}
          />
        </div>
        <div>
          author
          <input
            {...author.inputprops}
          />
        </div>
        <div>
          url for more info
          <input
            {...info.inputprops}
          />
        </div>
        <button>create</button>
        <button
          onClick={() => {
            content.reset()
            author.reset()
            info.reset()
          }}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
