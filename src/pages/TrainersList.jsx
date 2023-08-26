import { useEffect, useState } from "react";
import trainerService from "../services/trainer.service";
import { Button, Card, CardActions, CardContent, CardMedia, Container, Grid, Link, Typography } from "@mui/material";


function TrainersList() {
  const [trainers, setTrainers] = useState([])

  const getAllTrainers = async () => {
    try {
      const response = await trainerService.getAllTrainers()
      setTrainers(response.data)
    } catch (error) {
      console.log('Error at gathering trainers',error)
    }
  }

  useEffect(() => {
    getAllTrainers()
  }, [])

  return (
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
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: "56.25%",
                    }}
                    image="https://source.unsplash.com/random?wallpapers"
                  />
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
  )
}

export default TrainersList