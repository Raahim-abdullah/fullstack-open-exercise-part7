import { Link as RouterLink } from "react-router-dom"
import { Box, Typography, Button, Container } from "@mui/material"

const NotFound = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h1" component="div" sx={{ fontSize: "6rem", fontWeight: "bold", color: "error.main" }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ mb: 2, color: "text.primary" }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
          The page you're looking for doesn't exist.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          size="large"
        >
          Go back home
        </Button>
      </Box>
    </Container>
  )
}

export default NotFound

