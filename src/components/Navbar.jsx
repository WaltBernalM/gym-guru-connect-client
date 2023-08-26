import { useContext } from "react"
import { AuthContext } from "../context/auth.context"
import { ThemeProvider } from "@emotion/react"
import { GlobalStyles } from "@mui/styled-engine"
import {
  Link,
  AppBar,
  Button,
  CssBaseline,
  Toolbar,
  Typography,
  createTheme,
  Avatar,
} from "@mui/material"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"

function Navbar() {
  const { isLoggedIn, user, logout } = useContext(AuthContext)
  const defaultTheme = createTheme()
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <FitnessCenterIcon />
            </Avatar>
            <Link
              href="/"
              variant="button"
              color="text.primary"
              sx={{ my: 1, mx: 1.5, textDecoration: "none" }}
            >
              GymGuru Connect
            </Link>
          </Typography>
          <nav>
            {isLoggedIn && (
              <Link
                variant="button"
                color="text.primary"
                href="#"
                sx={{ my: 1, mx: 1.5 }}
              >
                Exercises
              </Link>
            )}

            {isLoggedIn && user.isTrainer && (
              <Link
                variant="button"
                color="text.primary"
                href={`/trainers/${user._id}`}
                sx={{ my: 1, mx: 1.5 }}
              >
                My Schedule
              </Link>
            )}

            {isLoggedIn && !user.isTrainer && (
              <>
                <Link
                  variant="button"
                  color="text.primary"
                  href="/trainers"
                  sx={{ my: 1, mx: 1.5 }}
                >
                  Trainers
                </Link>
                <Link
                  variant="button"
                  color="text.primary"
                  href={`/trainees/${user._id}`}
                  sx={{ my: 1, mx: 1.5 }}
                >
                  My Plan
                </Link>
              </>
            )}
          </nav>

          {!isLoggedIn && (
            <>
              <Button href="/signup" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                Signup
              </Button>
              <Button href="/login" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                Login
              </Button>
            </>
          )}

          {isLoggedIn && user && (
            <>
              <Button
                onClick={logout}
                variant="contained"
                sx={{ my: 1, mx: 1.5, bgcolor: "purple" }}
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  )
}

export default Navbar