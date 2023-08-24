import axios from 'axios'
import Cookies from 'js-cookie'

let baseUrl =
  process.env.ENV === "production"
    ? process.env.SERVER_URL
    : "http://localhost:5005"

const service = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
})

service.interceptors.request.use(config => {
  const storedToken = Cookies.get('authToken')
  if (storedToken) {
    config.headers = { Authorization: `Bearer ${storedToken}`}
  }
  return config
})

export default service