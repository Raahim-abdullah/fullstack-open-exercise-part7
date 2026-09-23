import { Alert } from "@mui/material"

const Notification = ({ message, type }) => {
  if (message === null) return null

  return (
    <Alert security={type} style={{ marginBottom: 10, marginTop: 10, }}>
      {message}
    </Alert>
  )
}

export default Notification
