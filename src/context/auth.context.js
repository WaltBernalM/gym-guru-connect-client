import { createContext, useEffect, useState } from 'react'
import authService from '../services/auth.service'
import Cookies from 'js-cookie'

const AuthContext = createContext()

const AuthProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const storeToken = (token) => {
    Cookies.set('authToken', token)
  }

  const authenticateUser = async () => {
    const storedToken = Cookies.get('authToken')

    if (storedToken) {
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
    } else {
      setIsLoggedIn(false)
      setIsLoading(false)
      setUser(null)
    }
  }

  const removeToken = () => {
    Cookies.remove('authToken')
  }

  const logout = () => { 
    removeToken()
    setIsLoggedIn(false)
    setIsLoading(false)
    setUser(null)
  }

  useEffect(() => {
    authenticateUser()
  }, [])

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      isLoading,
      storeToken,
      authenticateUser,
      logout
    }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }