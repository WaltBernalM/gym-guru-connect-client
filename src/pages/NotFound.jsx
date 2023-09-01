import { Container } from "@mui/material";
import NotFoundAnimation from "../components/NotFoundAnimation";

function NotFound() {
  return (
    <Container sx={{width: '100vw', height: '80vh',display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <NotFoundAnimation />
    </Container>
  )
}

export default NotFound