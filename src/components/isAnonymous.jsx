import { useContext } from "react"
import { AuthContext } from "../context/auth.context"
import { Navigate } from "react-router-dom"

function IsAnonymous(props) {
  const { isLoggedIn, isLoading } = useContext(AuthContext)

  if (isLoading) return <p>Loading ...</p>

  if (isLoggedIn) {
    return <Navigate to="/" />
  } else {
    return props.children
  }
}

export default IsAnonymous
