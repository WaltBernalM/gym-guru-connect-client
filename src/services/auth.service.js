import service from './index'

const authService = {
  signup: (formData) => service.post("/auth/signup", formData),
  login: (formData) => service.post("/auth/login", formData),
  verify: () => service.get("/auth/verify"),
  logout: () => service.post("/auth/logout"),
}

export default authService