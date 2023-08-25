import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from 'react-router-dom'
import trainerService from "../services/trainer.service"
import { Box, Button, Container, Grid, IconButton, List, ListItem, ListItemText, ListSubheader, Stack, Typography } from "@mui/material"
import { AuthContext } from "../context/auth.context"

import LockClockIcon from "@mui/icons-material/LockClock"
import EventAvailableIcon from "@mui/icons-material/EventAvailable"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import appointmentService from "../services/appointment.service"
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"

import dayjs from "dayjs"
import NewAppointmentForm from "../components/NewAppointmentForm"
import AppointmentsList from "../components/AppointmentsList"


const initialHours = [dayjs("2022-04-07T07:00"), dayjs("2022-04-17T19:00")]
const initialDay = dayjs().add(48, 'hour')

function TrainerProfile() {
  const [trainerInfo, setTrainerInfo] = useState(null)
  const [trainerSchedule, setTrainerSchedule] = useState(null)
  const [appointmentStatus, setAppointmentStatus] = useState('')
  const { trainerId } = useParams()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  
  const [hourRange, setHourRange] = useState(() => initialHours)
  const [date, setDate] = useState(initialDay)
  const [appointmentError, setAppointmentError] = useState(null)

  const getTrainer = async () => {
    try {
      const trainerFromDB = await trainerService.getTrainerInfo(trainerId)
      setTrainerInfo(trainerFromDB.data)
    } catch (error) {
      console.log(error.response.data.message)
    }
  }

  const filterAppointments = (dayInfo, isAvailable) => {
    const options = {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }
    const currentDate = new Date().toLocaleString("en-US", options)
    const date = new Date(dayInfo).toLocaleString("en-US", options)
    const today = new Date(currentDate)

    if (new Date(date) < today.setDate(today.getDate() + 2)) {
      return false
    } else {
      if (isAvailable) {
        return true
      } else {
        return false
      }
    }
  }

  const handleBookIn = async (appointmentId, trainerId, traineeId) => {
    try {
      const response = await appointmentService.traineeBookAppointment(
        appointmentId, trainerId, traineeId
      )
      setAppointmentStatus(response.data.message)
      setTimeout(() => navigate("/"), 2000)
    } catch (error) {
      setAppointmentStatus(error.response.data.message)
    }
  }

  const handleCreateBooks = async (trainerId) => {
    try {
      setAppointmentError(null)
      const hourStart = hourRange[0].$H
      const hourEnd = hourRange[1].$H
      const dayInfo = `${date.$M + 1}/${date.$D}/${date.$y}`
      if (hourStart > hourEnd) { 
        setAppointmentError('Hour Range Error')
        return
      }
      if (hourEnd > 22) {
        setAppointmentError("Hour end is too late")
        return
      }
      if (hourStart < 7) {
        setAppointmentError("Hour start is too early")
        return
      }
      if ((hourEnd - hourStart) > 12) {
        setAppointmentError("Hour range size is kinda' illegal")
        return
      }

      for (let h = hourStart; h <= hourEnd; h++) { 
        await appointmentService.createAppointment(
          trainerId,
          dayInfo,
          h
        )
      }
      // const response = await appointmentService.createAppointment(trainerId, dayInfo, hourStart)
    } catch (error) {
      setAppointmentError(error.response.data.message)
    }
  }

  const getTrainerSchedule = async () => {
    try {
        const scheduleFromDB =
          await appointmentService.getAppointmentsForTrainer(trainerId)
        setTrainerSchedule(scheduleFromDB.data)
    } catch (error) {
      console.log(error.response)
    }
  }

  const handleDeleteAppointment = async (appointmentId, trainerId) => { 
    console.log(appointmentId, trainerId)
  }

  useEffect(() => {
    getTrainer()
    getTrainerSchedule()
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
                component="h1"
                variant="h2"
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

          {/* Trainer's Scedule */}
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              maxHeight: 300,
              "& ul": { padding: 0 },
              border: "6px solid purple",
              borderRadius: "20px",
              mt: 1,
            }}
            subheader={<li />}
          >
            <ul style={{ textAlign: "center" }}>
              <ListSubheader>Open Schedule</ListSubheader>
              {trainerInfo.schedule
                .filter(({ dayInfo, isAvailable }) => {
                  return filterAppointments(dayInfo, isAvailable)
                })
                .map((appointment) => {
                  return (
                    <ListItem
                      key={appointment._id}
                      disableGutters
                      sx={{ textAlign: "center" }}
                    >
                      <ListItemText>
                        {appointment.dayInfo} @ {appointment.hour}
                        {":00"}
                        {trainerInfo.trainees.includes(user._id) ? (
                          <IconButton
                            onClick={() =>
                              handleBookIn(
                                appointment._id,
                                trainerInfo._id,
                                user._id
                              )
                            }
                          >
                            <EventAvailableIcon />
                          </IconButton>
                        ) : (
                          <LockClockIcon />
                        )}
                      </ListItemText>
                    </ListItem>
                  )
                })}
            </ul>
          </List>

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
                component="h2"
                variant="h3"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Welcome <br /> {trainerInfo.name.firstName}{" "}
                {trainerInfo.name.lastName}
              </Typography>
            </Container>
          </Box>

          {/* <Button variant="outlined">Add Consults</Button> */}
          <NewAppointmentForm
            day={date}
            setDay={setDate}
            hourRange={hourRange}
            setHourRange={setHourRange}
            handleCreateBooks={handleCreateBooks}
            appointmentError={appointmentError}
          />

          <AppointmentsList
            trainerSchedule={trainerSchedule}
            deleteAppointment={handleDeleteAppointment}
          />
        </>
      )}
    </div>
  )
}

export default TrainerProfile
