import { useContext } from "react"
import { AuthContext } from "../context/auth.context"
import { Navigate } from "react-router-dom"
import LoadingAnimation from "./LoadingAnimation"
import { Container } from "@mui/material"

function IsAnonymous(props) {
  const { isLoggedIn, isLoading } = useContext(AuthContext)

  if (isLoading) return (
    <Container
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoadingAnimation />
    </Container>
  )

  if (isLoggedIn) {
    return <Navigate to="/" />
  } else {
    return props.children
  }
}

export default IsAnonymous
