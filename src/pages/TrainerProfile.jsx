import { useContext, useEffect, useState } from "react"
import { useParams } from 'react-router-dom'
import trainerService from "../services/trainer.service"
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material"
import { AuthContext } from "../context/auth.context"

import PersonAddIcon from "@mui/icons-material/PersonAdd"
import appointmentService from "../services/appointment.service"
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined"

import NewAppointmentForm from "../components/NewAppointmentForm"
import AppointmentsList from "../components/AppointmentsList"

function TrainerProfile() {
  const [trainerInfo, setTrainerInfo] = useState(null)
  const [trainerSchedule, setTrainerSchedule] = useState(null)
  const [appointmentStatus, setAppointmentStatus] = useState('')
  const { trainerId } = useParams()
  const { user } = useContext(AuthContext)

  const getTrainer = async () => {
    try {
      const trainerFromDB = await trainerService.getTrainerInfo(trainerId)
      setTrainerInfo(trainerFromDB.data)
    } catch (error) {
      setAppointmentStatus(error.response.data.message)
    }
  }
  
  const getTrainerSchedule = async () => {
    try {
      const scheduleFromDB = await appointmentService
        .getAppointmentsForTrainer(trainerId)      
      setTrainerSchedule(scheduleFromDB.data)
    } catch (error) {
      setAppointmentStatus(error.response.data.message)
    }
  }

  useEffect(() => {
    getTrainer()
    getTrainerSchedule()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* For Trainee */}
      {trainerInfo && user && !user.isTrainer && (
        <>
          <Box
            sx={{
              bgcolor: "background.paper",
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h3"
                variant="h4"
                align="center"
                color="text.primary"
                gutterBottom
              >
                {trainerInfo.name.firstName} {trainerInfo.name.lastName}
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
              >
                {trainerInfo.personalInfo.bio}
              </Typography>
              <Typography>
                {trainerInfo.trainees.includes(user._id) && (
                  <small>I'm your actual trainer</small>
                )}
              </Typography>
              {!trainerInfo.trainees.includes(user._id) && (
                <Stack
                  sx={{ pt: 4 }}
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                >
                  <Button
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    variant="contained"
                  >
                    <div>Add me as your Coach!</div>
                    <div>
                      <PersonAddIcon sx={{ marginLeft: 1 }} />
                    </div>
                  </Button>
                </Stack>
              )}
            </Container>
          </Box>

          {user && trainerSchedule && trainerSchedule.schedule && (
            <AppointmentsList
              trainerSchedule={trainerSchedule}
              trainerInfo={trainerInfo}
            />
          )}

          {/* Appointment message */}
          {appointmentStatus && (
            <Grid
              container
              sx={{
                color: "orange",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "justify",
              }}
            >
              <ReportProblemOutlinedIcon />
              <span>{appointmentStatus}</span>
            </Grid>
          )}
        </>
      )}

      {/* For Trainer */}
      {trainerInfo && user && user._id === trainerInfo._id && (
        <>
          <Box
            sx={{
              bgcolor: "background.paper",
              pt: 2,
              pb: 0,
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h3"
                variant="h4"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Welcome <br /> {trainerInfo.name.firstName}{" "}
                {trainerInfo.name.lastName}
              </Typography>
            </Container>
          </Box>

          {user &&
            user.isTrainer &&
            trainerSchedule &&
            trainerSchedule.schedule && (
            <NewAppointmentForm
              
                getTrainerSchedule={getTrainerSchedule}
              />
            )}

          {user &&
            user.isTrainer &&
            trainerSchedule &&
            trainerSchedule.schedule && (
              <AppointmentsList
                trainerSchedule={trainerSchedule}
                trainerInfo={trainerInfo}
              />
            )}
        </>
      )}
    </div>
  )
}

export default TrainerProfile
