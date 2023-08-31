import { useContext } from "react"
import { AuthContext } from "../context/auth.context"
import { Navigate } from "react-router-dom"

function IsPrivate (props) {
  const { isLoggedIn, isLoading } = useContext(AuthContext)

  if (isLoading) return <p>Loading ...</p>

  if (!isLoggedIn) {
    return <Navigate to="/login" />
  } else {
    return props.children
  }
}

export default IsPrivate
