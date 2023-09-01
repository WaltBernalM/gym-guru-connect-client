import { useContext, useState } from "react"
import { AuthContext } from "../context/auth.context"
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Avatar,
  Box,
  IconButton,
  Menu,
  Container,
  MenuItem,
  Tooltip,
} from "@mui/material"

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import MenuIcon from "@mui/icons-material/Menu"

const settings = ["signup", "login"]
const pages = ["exercises", "trainers", "trainee"]

function Navbar() {
  const { isLoggedIn, user, logout, isLoading } = useContext(AuthContext)
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }
  
  return (
    <AppBar
      position="static"
      color="primary"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <FitnessCenterIcon
            sx={{ display: { xs: "none", md: "flex", mr: 1 } }}
          />
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            component="a"
            href="/"
            sx={{
              ml: 1,
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            GymGuru
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              {isLoggedIn && <MenuIcon />}
            </IconButton>
            {!isLoading && (
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => {
                  let link, text
                  if (page === "trainers" && isLoggedIn && user.isTrainer) {
                    link = `/trainers/${user._id}`
                    text = "My Schedule"
                  } else if (
                    page === "trainee" &&
                    isLoggedIn &&
                    !user.isTrainer
                  ) {
                    link = `/trainee/${user._id}`
                    text = "My Plan"
                  } else if (page === "exercises" && isLoggedIn) {
                    link = `/exercises`
                    text = "Exercises"
                  } else if (
                    page === "trainers" &&
                    isLoggedIn &&
                    !user.isTrainer
                  ) {
                    link = "/trainers"
                    text = "Trainers"
                  }

                  return (
                    link &&
                    text && (
                      <MenuItem key={page} onClick={handleCloseUserMenu}>
                        <Typography
                          href={link}
                          textAlign="center"
                          sx={{ textDecoration: "none", color: "black" }}
                          component="a"
                        >
                          {text}
                        </Typography>
                      </MenuItem>
                    )
                  )
                })}
              </Menu>
            )}
          </Box>
          <FitnessCenterIcon
            sx={{ display: { sx: "flex", md: "none", mr: 1 } }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              ml: 1,
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            GymGuru
          </Typography>

          {!isLoading && (
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => {
                let link, text
                if (page === "trainers" && isLoggedIn && user.isTrainer) {
                  link = `/trainers/${user._id}`
                  text = "My Schedule"
                } else if (
                  page === "trainee" &&
                  isLoggedIn &&
                  !user.isTrainer
                ) {
                  link = `/trainee/${user._id}`
                  text = "My Plan"
                } else if (page === "exercises" && isLoggedIn) {
                  link = `/exercises`
                  text = "Exercises"
                } else if (
                  page === "trainers" &&
                  isLoggedIn &&
                  !user.isTrainer
                ) {
                  link = "/trainers"
                  text = "Trainers"
                }

                return (
                  link &&
                  text && (
                    <MenuItem key={page} onClick={handleCloseUserMenu}>
                      <Typography
                        href={link}
                        textAlign="center"
                        sx={{ textDecoration: "none", color: "white" }}
                        component="a"
                      >
                        {text}
                      </Typography>
                    </MenuItem>
                  )
                )
              })}
            </Box>
          )}

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="I" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>

            {!isLoading && (
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => {
                  let text, link

                  if (setting === "login" && !isLoggedIn) {
                    text = "Login"
                    link = "/login"
                  } else if (setting === "signup" && !isLoggedIn) {
                    text = "Sign up"
                    link = "/signup"
                  }
                  return (
                    text &&
                    link && (
                      <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography
                          href={link}
                          sx={{ textDecoration: "none", color: "black" }}
                          component="a"
                          textAlign="center"
                        >
                          {text}
                        </Typography>
                      </MenuItem>
                    )
                  )
                })}
                {isLoggedIn && (
                  // <MenuItem>
                  <Button
                    onClick={logout}
                    size="small"
                    variant="text"
                    sx={{ my: 1, mx: 1.5, color: "red" }}
                  >
                    {"Logout"}
                  </Button>
                  // </MenuItem>
                )}
              </Menu>
            )}
          </Box>

          {/* {!isLoading && (
          <>
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
                    href={`/trainee/${user._id}`}
                    sx={{ my: 1, mx: 1.5 }}
                  >
                    My Plan
                  </Link>
                </>
              )}
            </nav>

            {!isLoggedIn && (
              <>
                <Button
                  href="/signup"
                  variant="outlined"
                  sx={{ my: 1, mx: 1.5 }}
                >
                  Signup
                </Button>
                <Button
                  href="/login"
                  variant="outlined"
                  sx={{ my: 1, mx: 1.5 }}
                >
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
                  {"Logout"}
                </Button>
              </>
            )}
          </>
        )} */}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar