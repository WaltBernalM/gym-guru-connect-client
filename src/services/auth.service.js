import service from './index'

const authService = {
  signup: (formData) => service.post("/auth/signup", formData),
  login: (formData) => service.post("/auth/login", formData),
  verify: () => service.get("/auth/verify")
}

export default authService