import { useState } from "react"
import { ThemeProvider } from "@emotion/react"
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  createTheme,
  Link,
} from "@mui/material"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined"

import { useNavigate } from "react-router-dom"
import authService from "../services/auth.service"

const initForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  isTrainer: false
}

const defaultTheme = createTheme()

function Signup() {
  const [formData, setFormData] = useState(initForm)
  const [errorMessage, setErrorMessage] = useState(undefined)

  const navigate = useNavigate()

  const handleOnChange = (field, value) => {
    setFormData((prevValue) => ({...prevValue, [field]:value}))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    const submitForm = async () => {
      try {
        await authService.signup(formData)
        setFormData(initForm)
        navigate('/login')
      } catch (error) {
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleOnSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={(e) => handleOnChange("firstName", e.target.value)}
                  value={formData.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={(e) => handleOnChange("lastName", e.target.value)}
                  value={formData.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => handleOnChange("email", e.target.value)}
                  value={formData.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(e) => handleOnChange("password", e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="isTrainer" color="primary" />}
                  label="I'm a Trainer"
                  checked={formData.isTrainer}
                  onChange={(e) =>
                    handleOnChange("isTrainer", e.target.checked)
                  }
                />
              </Grid>
            </Grid>

            {errorMessage && (
              <Grid
                container
                sx={{
                  color: "red",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: 'justify'
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
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Log in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default Signup