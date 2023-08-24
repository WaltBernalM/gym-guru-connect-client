import LockOutlined from "@mui/icons-material/LockOutlined"
import { Avatar, Box, Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, Link, TextField, Typography } from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined"

import { useState, useContext } from "react"
import authService from "../services/auth.service"
import { AuthContext } from "../context/auth.context"
import { useNavigate } from 'react-router-dom'

const defaultTheme = createTheme()

const initForm = {
  email: '',
  password: '',
  isTrainer: false,
}

function Login() {
  const [formData, setFormData] = useState(initForm)
  const [ errorMessage, setErrorMessage] = useState(undefined)
  const { authenticateUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleOnChange = (field, value) => {
    setFormData(prevData => ({...prevData, [field]: value}))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    const submitForm = async () => { 
      try {
        await authService.login(formData)
        authenticateUser()
        navigate('/')
      } catch (error) {
        console.log(error)
        setErrorMessage(error.response.data.message)
      }
    }
    submitForm()
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <Box
            component="form"
            onSubmit={handleOnSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => handleOnChange("email", e.target.value)}
              value={formData.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => handleOnChange("password", e.target.value)}
              value={formData.password}
            />
            <FormControlLabel
              control={<Checkbox value="isTrainer" color="primary" />}
              label="I'm a Trainer"
              checked={formData.isTrainer}
              onChange={(e) => handleOnChange("isTrainer", e.target.checked)}
            />
            {errorMessage && (
              <Grid
                container
                sx={{
                  color: "red",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "justify",
                }}
              >
                <ReportProblemOutlinedIcon />
                <span>{errorMessage}</span>
              </Grid>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
            <Grid container justifyContent="flex-end">
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default Login