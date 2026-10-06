import { Alert } from "@mui/material"
import { useNotification } from "../store"

const Notification = () => {
  const { message, type } = useNotification()
  if (message === null) return null

  return (
    <Alert security={type} style={{ marginBottom: 10, marginTop: 10, }}>
      {message}
    </Alert>
  )
}

export default Notification
