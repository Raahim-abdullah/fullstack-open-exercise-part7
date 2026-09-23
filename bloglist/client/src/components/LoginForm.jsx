import { TextField, Button } from "@mui/material"
const LoginForm = ({ handleSubmit, username, setUsername, password, setPassword }) => {

  return (
    <div>
      <h2>Log in to application</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>login</Button>
      </form>
    </div>
  )
}

export default LoginForm
