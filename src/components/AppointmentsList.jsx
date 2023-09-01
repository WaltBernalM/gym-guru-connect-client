import { Button, Divider, Grid, List, ListItem, ListItemText, ListSubheader, Typography, } from "@mui/material"

import EventBusyIcon from "@mui/icons-material/EventBusy"
import PersonSearchIcon from "@mui/icons-material/PersonSearch"
import { AuthContext } from "../context/auth.context"
import { Fragment, useContext, useEffect, useState } from "react"

import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined"
import EventAvailableIcon from "@mui/icons-material/EventAvailable"
import LockClockIcon from "@mui/icons-material/LockClock"

import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import dayjs from "dayjs"
import appointmentService from "../services/appointment.service"
import { useNavigate } from "react-router-dom"

function AppointmentsList(props) {
  const { trainerSchedule, trainerInfo } = props
  const { user } = useContext(AuthContext)
  
  const [dateFilter, setDateFilter] = useState(null)
  const [filterMessage, setFilterMessage] = useState(null)
  const [filtered, setFiltered] = useState(trainerSchedule.schedule)
  
  const [deletionError, setDeletionError] = useState(null)

  const navigate = useNavigate()
  const [appointmentStatus, setAppointmentStatus] = useState("")

  const options = {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }
  const currentDate = new Date().toLocaleString("en-US", options)
  const today = new Date(currentDate)

  const handleFilter = (date) => {
    if (date) {
      setDateFilter(date)
      setFilterMessage(null)
      const dateToSearch = `${date.$M + 1}/${date.$D}/${date.$y}`
      const filteredSchedule = trainerSchedule.schedule.filter(appointment => {
        return appointment.dayInfo === dateToSearch
      })
      if (filteredSchedule.length > 0) {
        setFiltered(filteredSchedule)
      } else {
        setFiltered(trainerSchedule.schedule)
        setFilterMessage("No consults for that date")
      }
    }
  }

  useEffect(() => {
    setFiltered(trainerSchedule.schedule)
  }, [trainerSchedule])

  const hanldeDelete = async (appointmentId, trainerId) => {
    try {
      setDeletionError(null)
      const response = await appointmentService.deletAppointmentForTrainer(
        appointmentId,
        trainerId
      )
      setFiltered(response.data.schedule)
    } catch (error) { 
      setDeletionError(error.response.data.message)
    }
  }

  const handleBookIn = async (appointmentId, trainerId, traineeId) => {
    try {
      const response = await appointmentService.traineeBookAppointment(
        appointmentId,
        trainerId,
        traineeId
      )
      setAppointmentStatus(response.data.message)
      setTimeout(() => navigate(`/trainee/${user._id}`), 1000)
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
  
  return (
    <>
      {((!user.isTrainer && trainerInfo.trainees.includes(user._id)) ||
        user.isTrainer) &&
        <List
          sx={{
            width: "100%",
            maxWidth: 300,
            bgcolor: "background.paper",
            position: "relative",
            overflow: "auto",
            maxHeight: 310,
            "& ul": { padding: 0, margin: 1 },
            border: "6px solid purple",
            borderRadius: "20px",
            mt: 1,
          }}
          subheader={<li />}
        >
          <ul style={{ textAlign: "center" }}>
            <ListSubheader>
              {filtered.length > 0 ? (
                <DatePicker
                  sx={{ marginTop: 1, paddingBottom: 1 }}
                  label={
                    filterMessage ? (
                      <span style={{ color: "red" }}>{filterMessage}</span>
                    ) : (
                      "Date Filter"
                    )
                  }
                  slotProps={{ textField: { size: "small" } }}
                  minDate={dayjs(new Date())}
                  onChange={(newValue) => handleFilter(newValue)}
                  value={dateFilter}
                />
              ) : (
                "Is empty"
              )}
            </ListSubheader>

            {/* Render of list items */}
            {filtered
              // eslint-disable-next-line array-callback-return
              .filter((a) => {
                const dateInAppointment = new Date(a.dayInfo).toLocaleString(
                  "en-US",
                  options
                )
                if (user.isTrainer) {
                  return new Date(dateInAppointment) >= today ? true : false
                } else if (!user.isTrainer) {
                  const { dayInfo, isAvailable } = a
                  return filterAppointments(dayInfo, isAvailable)
                }
              })
              .map((appointment) => {
                return (
                  <Fragment key={appointment._id}>
                    <ListItem disableGutters sx={{ textAlign: "center" }}>
                      {user.isTrainer && (
                        <ListItemText>
                          {`${appointment.dayInfo} @ ${appointment.hour}:00`}
                          {appointment.traineeId ? (
                            <Button
                              sx={{ ml: 2 }}
                              variant="contained"
                              startIcon={<PersonSearchIcon />}
                              color="info"
                              href={`/trainee/${appointment.traineeId._id}`}
                            >
                              {`${appointment.traineeId.name.firstName}`}
                            </Button>
                          ) : (
                            <Button
                              sx={{ ml: 2 }}
                              startIcon={<EventBusyIcon />}
                              color="error"
                              disabled={
                                new Date(appointment.dayInfo) > new Date(today)
                                  ? false
                                  : true
                              }
                              onClick={() =>
                                hanldeDelete(appointment._id, user._id)
                              }
                            >
                              Remove
                            </Button>
                          )}
                        </ListItemText>
                      )}
                      {!user.isTrainer && (
                        <ListItemText>
                          <Typography>
                            {appointment.dayInfo} @ {appointment.hour}
                            {":00"}
                          </Typography>
                          {trainerInfo.trainees.includes(user._id) ? (
                            <Button
                              color="success"
                              variant="contained"
                              onClick={() =>
                                handleBookIn(
                                  appointment._id,
                                  trainerInfo._id,
                                  user._id
                                )
                              }
                              startIcon={
                                <EventAvailableIcon />
                              }
                            > Book IN</Button>
                          ) : (
                            <LockClockIcon />
                          )}
                        </ListItemText>
                      )}
                    </ListItem>
                    <Divider orientation="horizontal" flexItem />
                  </Fragment>
                )
              })}
          </ul>
        </List>}
      {deletionError && (
        <Grid
          container
          sx={{
            color: "red",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "justify",
            mt: 1,
          }}
        >
          <ReportProblemOutlinedIcon sx={{ mr: 1 }} />
          <span>{deletionError}</span>
        </Grid>
      )}
      {/* Appointment message */}
      {appointmentStatus && (
        <Grid
          container
          sx={{
            color: "green",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "justify",
          }}
        >
          <span>{appointmentStatus}</span>
        </Grid>
      )}
    </>
  )
}

export default AppointmentsList