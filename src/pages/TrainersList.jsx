import { useEffect, useState } from "react";
import trainerService from "../services/trainer.service";
import { Button, Card, CardActions, CardContent, CardMedia, Container, Grid, Link, Slide, Typography } from "@mui/material";
import CoachAnimation from "../components/CoachAnimation";
import ServerErrorAnimation from "../components/ServerErrorAnimation";


function TrainersList() {
  const [trainers, setTrainers] = useState([])
  const [error, setError] = useState(false)

  const getAllTrainers = async () => {
    try {
      setError(false)
      const response = await trainerService.getAllTrainers()
      setTrainers(response.data)
    } catch (error) {
      setError(true)
    }
  }

  useEffect(() => {
    getAllTrainers()
  }, [])

  return (
    <>
      {!error && (
        <Slide direction="up" in={true}>
          <div>
            <Container sx={{ py: 8 }} maxWidth="md">
              <Grid container spacing={4}>
                {trainers.map((trainer) => {
                  return (
                    <Grid item key={trainer._id} xs={12} sm={6} md={4}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <CardMedia component="div" sx={{ pt: 0 }}>
                          <CoachAnimation />
                        </CardMedia>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {trainer.name.firstName} {trainer.name.lastName}
                          </Typography>
                          <Typography>
                            About me: {trainer.personalInfo.bio}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Link href={`/trainers/${trainer._id}`}>
                            <Button>lets work together!</Button>
                          </Link>
                        </CardActions>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid>
            </Container>
          </div>
        </Slide>
      )}
      {error && (
        <div style={{ height: "70vh", display: "flex", alignItems: "center" }}>
          <ServerErrorAnimation />
        </div>
      )}
    </>
  )
}

export default TrainersList