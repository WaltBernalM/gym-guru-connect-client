import { useContext, useEffect, useState } from "react"
import { useParams } from 'react-router-dom'
import trainerService from "../services/trainer.service"
import { Box, Button, Container, Grid, Grow, Stack, Typography, useMediaQuery } from "@mui/material"
import { AuthContext } from "../context/auth.context"

import PersonAddIcon from "@mui/icons-material/PersonAdd"
import appointmentService from "../services/appointment.service"
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined"

import NewAppointmentForm from "../components/NewAppointmentForm"
import AppointmentsList from "../components/AppointmentsList"
import CoachAnimation from "../components/CoachAnimation"

function TrainerProfile() {
  const [trainerInfo, setTrainerInfo] = useState(null)
  const [trainerSchedule, setTrainerSchedule] = useState(null)
  const [appointmentStatus, setAppointmentStatus] = useState('')
  const { trainerId } = useParams()
  const { user } = useContext(AuthContext)
  const [coachAssignError, setCoachAssignError] = useState(null)

  const getTrainer = async () => {
    try {
      const trainerFromDB = await trainerService.getTrainerInfo(trainerId)
      setTrainerInfo(trainerFromDB.data)
      if (!user.isTrainer && trainerFromDB.data.trainees.includes(user._id)) {
        getTrainerSchedule()
      } else if (user.isTrainer && trainerFromDB) {
        getTrainerSchedule()
      }
    } catch (error) {
      setAppointmentStatus(error.response.data.message)
    }
  }
  
  const getTrainerSchedule = async () => {
    try {
      const scheduleFromDB =
        await appointmentService.getAppointmentsForTrainer(trainerId)
      setTrainerSchedule(scheduleFromDB.data)
    } catch (error) {
      setAppointmentStatus(error.response.data.message)
    }
  }

  useEffect(() => {
    getTrainer()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const changeToNewCoach = async () => {
    try {
      const traineeId = user._id
      await trainerService.assignTraineeToTrainer(trainerId, traineeId)
      getTrainer()
    } catch (error) {
      setCoachAssignError(error.response.data.message)
    }
  }

  const isSmallScreen = useMediaQuery("(max-width:600px)")
  const coachAnimWidth = isSmallScreen ? "10px" : "20%"
  
  return (
    <Grow
      in={trainerInfo && user ? true : false}
      style={{ transformOrigin: "0 0 0" }}
      {...(trainerInfo && user ? { timeout: 1000 } : {})}
    >
      <div
        style={{
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Container sx={{ width: `${coachAnimWidth}` }}>
          <CoachAnimation />
        </Container>
        {/* For Trainee */}
        {trainerInfo && user && !user.isTrainer && (
          <>
            <Box
              sx={{
                bgcolor: "background.paper",
                pt: 0,
                mt: 0,
                pb: 6,
              }}
            >
              <Container maxWidth="sm">
                <Typography
                  component="h5"
                  variant="h6"
                  align="center"
                  color="text.primary"
                  gutterBottom
                >
                  {trainerInfo.name.firstName} {trainerInfo.name.lastName}
                </Typography>
                <Typography
                  variant="p"
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
                    direction="column"
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Button
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      variant="contained"
                      disabled={coachAssignError ? true : false}
                      endIcon={<PersonAddIcon />}
                      onClick={() => changeToNewCoach()}
                    >
                      Add me as your Coach!
                    </Button>
                    <Typography sx={{ color: "red", maxWidth: "60%" }}>
                      {coachAssignError}
                    </Typography>
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
                pt: 0,
                pb: 0,
              }}
            >
              <Container maxWidth="sm">
                <Typography
                  component="h5"
                  variant="h6"
                  align="center"
                  color="text.primary"
                  gutterBottom
                >
                  Welcome <br /> {trainerInfo.name.firstName}{" "}
                  {trainerInfo.name.lastName}
                </Typography>
              </Container>
            </Box>

            <Box display={"flex"} flexWrap={"wrap"} justifyContent={"space-around"} width={'100%'}>
              {user &&
                user.isTrainer &&
                trainerSchedule &&
                trainerSchedule.schedule && (
                  <NewAppointmentForm getTrainerSchedule={getTrainerSchedule} />
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
            </Box>
          </>
        )}
      </div>
    </Grow>
  )
}

export default TrainerProfile
