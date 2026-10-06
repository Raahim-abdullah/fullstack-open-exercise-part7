import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLoginAction } from "../store"

import { TextField, Button } from "@mui/material"
const LoginForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useLoginAction()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    login({ username, password })
    navigate("/")
  }
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
