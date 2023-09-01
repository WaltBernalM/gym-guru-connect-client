import { Box, Button, Container, Stack, Typography } from "@mui/material"
import DietPlanAnimation from "../components/DietPlanAnimation"
import { AuthContext } from "../context/auth.context"
import { useContext } from "react"
import TrainerAnimation from "../components/TrainerAnimation"

function HomePage() {
  const { isLoggedIn } = useContext(AuthContext)

  return (
    <div>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 1,
            pb: 1,
          }}
        >
          <Container maxWidth="sm" align="center">
            <DietPlanAnimation />
            <Typography
              component="h4"
              variant="h5"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Manage your Health Program with us!
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              paragraph
              marginBottom={0}
            >
              We've also been there, where you receive all the information by
              email, and it all depends if you save it locally, or you'll need
              to search for it.
            </Typography>
            {!isLoggedIn && (
              <Stack
                sx={{ pt: 1 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                <Button href="/signup" variant="contained">
                  Sign up now!
                </Button>
                <Button href="/login" variant="outlined">
                  Go to see your Plan
                </Button>
              </Stack>
            )}
          </Container>
        </Box>
        <Box align="center">
          <Container>
            <div style={{ maxWidth: "20%" }}>
              <TrainerAnimation />
            </div>
            <Typography
              variant="p"
              align="center"
              color="text.secondary"
              paragraph
              maxWidth={"75%"}
              paddingBottom={0}
              marginBottom={1}
            >
              You'll be able to keep in track with your Nutrition Program
            </Typography>
            <Typography
              variant="p"
              align="center"
              color="text.secondary"
              paragraph
              maxWidth={"75%"}
              paddingTop={0}
              marginBottom={1}
            >
              And maybe you forget from time to time forget what's next in your
              Exercise Routine. So worry no more!
            </Typography>
          </Container>
        </Box>
      </main>
    </div>
  )
}

export default HomePage