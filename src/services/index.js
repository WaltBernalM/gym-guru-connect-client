import axios from 'axios'
// import Cookies from 'js-cookie'

let baseUrl =
  process.env.REACT_APP_ENV === "production"
    ? process.env.REACT_APP_SERVER_URL
    : "http://localhost:5005"

const service = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": 'application/json', // fixes the type of conten for this applicaiton (we will receive JSON)
  },
  withCredentials: true, // allows to add credentials such as the motherfucking Cookie!
})


// Interceptors won't work with httpOnly Cookie
// service.interceptors.request.use(config => {
//   const storedToken = Cookies.get('authToken')
//   if (storedToken) {
//     config.headers["Authorization"] = `Bearer ${storedToken}`
//   }
//   return config
// })

export default service