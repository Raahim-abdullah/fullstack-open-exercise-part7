import { Typography } from "@mui/material"

const User = ({ user }) => {

  if (!user) (<Typography>Loading...</Typography>)
  return (
    <div>
      <Typography variant="h4">{user.name}</Typography>
      <Typography>added blogs</Typography>
      <ul>
        {user.blogs.map(blog => <li key={blog.id}>{blog.title}</li>)}
      </ul>
    </div>
  )
}

export default User
