import { createContext, useEffect, useState } from 'react'
import authService from '../services/auth.service'

const AuthContext = createContext()

/* Code modification to work with httpOnly Cookies */
const AuthProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false) 
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const authenticateUser = async () => {
    try {
      const response = await authService.verify()
      const userInfo = response.data
      setIsLoggedIn(true)
      setIsLoading(false)
      setUser(userInfo)
    } catch (error) {
      setIsLoggedIn(false)
      setIsLoading(false)
      setUser(null)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error(error)
    }
    setIsLoggedIn(false)
    setIsLoading(false)
    setUser(null)
  }

  useEffect(() => {
    authenticateUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        isLoading,
        authenticateUser,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }