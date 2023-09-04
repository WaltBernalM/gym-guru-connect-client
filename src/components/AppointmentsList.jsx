import { Button, Checkbox, Container, Fade, FormControlLabel, FormGroup, Grid, IconButton, List, ListItem, ListItemText, ListSubheader, Paper, Typography, useMediaQuery, } from "@mui/material"

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

import FilterAltIcon from "@mui/icons-material/FilterAlt"
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined"

function AppointmentsList(props) {
  const { trainerSchedule, trainerInfo } = props
  const { user } = useContext(AuthContext)
  
  const [dateFilter, setDateFilter] = useState(null)
  const [filterMessage, setFilterMessage] = useState(null)
  const [filtered, setFiltered] = useState(trainerSchedule.schedule)
  const [seeOnlyBooked, setSeeOnlyBooked] = useState(false)
  
  const [deletionError, setDeletionError] = useState(null)

  const [filterVisible, setFilterVisible] = useState(false)

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

  const plus24 = today.setDate(today.getDate() + 1)
  const todayPlus24 = new Date(plus24).toLocaleString("en-US", options)

  const handleFilter = (date, seeBooked) => {
    let dateToSearch, filteredSchedule
    setFilterMessage(null)

    if (date) {
      setDateFilter(date)
      dateToSearch = `${date.$M + 1}/${date.$D}/${date.$y}`
    }
    if (date && seeBooked) {
      filteredSchedule = trainerSchedule.schedule.filter((appointment) => {
        return appointment.dayInfo === dateToSearch && !appointment.isAvailable
      })
    }
    if (date && !seeBooked) {
      filteredSchedule = trainerSchedule.schedule.filter(appointment => {
        return appointment.dayInfo === dateToSearch
      })
    } 

    if (filteredSchedule.length === 0) {
      setFilterMessage("No consults for that date")
      setFiltered([])
    } else {
      setFiltered(filteredSchedule)
    }
  }

  const handleCheckbox = (e) => {
    setSeeOnlyBooked(e.target.checked)
    if (dateFilter) {
      handleFilter(dateFilter, e.target.checked)
    } else if (e.target.checked && !dateFilter) {
      setFiltered(filtered.filter(a => !a.isAvailable))
    } else {
      setFiltered(trainerSchedule.schedule)
    }
  }

  useEffect(() => {
    !filterMessage && setFiltered(trainerSchedule.schedule)
    filterMessage && setTimeout(() => {
      setFilterMessage("")
      setFiltered(trainerSchedule.schedule)
      setSeeOnlyBooked(false)
    }, 2000)
  }, [trainerSchedule, filterMessage])

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

  const isSmallScreen = useMediaQuery("(max-width:600px)")
  const maxHeight = isSmallScreen ? 360 : 300

  const shouldDisableDate = (date) => {
    const formattedDate = new Date(date).toLocaleString("en-US", options)
    const dayInfoArray = trainerSchedule.schedule.map(
      (appointment) => appointment.dayInfo
    )
    return !dayInfoArray.includes(formattedDate)
  }
  
  return (
    <>
      {((!user.isTrainer && trainerInfo.trainees.includes(user._id)) ||
        user.isTrainer) && (
        <Paper
          sx={{ minWidth: 350, display: "flex", justifyContent: "center" }}
          elevation={5}
        >
          <List
            sx={{
              width: "90%",
              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              maxHeight: `${maxHeight}px`,
              "& ul": { padding: 0, margin: 1 },
              mt: 1,
            }}
            subheader={<li />}
          >
            <ul style={{ textAlign: "center" }}>
              <ListSubheader sx={{ width: "auto" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <IconButton
                    onClick={() => setFilterVisible(!filterVisible)}
                    sx={{ marginRight: 1 }}
                  >
                    <FilterAltIcon />
                  </IconButton>
                  {!user.isTrainer && (
                    <small>Only bookings +48h accepted</small>
                  )}
                  {user.isTrainer && (
                    <small>Only bookings +24h can be removed</small>
                  )}
                </div>

                {filterVisible && (
                  <Fade in={filterVisible}>
                    <Container
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingBottom: 1,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-around",
                          width: "100%",
                        }}
                      >
                        <DatePicker
                          shouldDisableDate={shouldDisableDate}
                          sx={{
                            marginTop: 0,
                            paddingBottom: 0,
                            maxWidth: 180,
                            paddingTop: 0,
                          }}
                          label={
                            filterMessage ? (
                              <span style={{ color: "red" }}>
                                {filterMessage}
                              </span>
                            ) : (
                              "Date Filter"
                            )
                          }
                          slotProps={{ textField: { size: "small" } }}
                          minDate={dayjs(new Date()).set(
                            "date",
                            dayjs(new Date()).date() + 2
                          )}
                          onChange={(newValue) => handleFilter(newValue)}
                          value={dateFilter}
                          disabled={filterMessage ? true : false}
                        />
                        <IconButton
                          onClick={() => {
                            setDateFilter(null)
                            setFiltered(trainerSchedule.schedule)
                          }}
                          disabled={filterMessage ? true : false}
                        >
                          <CachedOutlinedIcon />
                        </IconButton>
                      </div>
                      {user.isTrainer && (
                        <FormGroup sx={{ marginTop: 1 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                disabled={filterMessage ? true : false}
                                checked={seeOnlyBooked}
                                onChange={handleCheckbox}
                                sx={{ margin: 0, padding: 0, marginLeft: 2 }}
                              />
                            }
                            label={<small>booked only</small>}
                          />
                        </FormGroup>
                      )}
                    </Container>
                  </Fade>
                )}
              </ListSubheader>

              {/* Render of list items */}
              {filtered.length === 0
                ? "No appointments"
                : filtered
                    .filter((a) => {
                      const dateInAppointment = new Date(
                        a.dayInfo
                      ).toLocaleString("en-US", options)
                      if (user.isTrainer) {
                        return new Date(dateInAppointment) >= today
                          ? true
                          : false
                      } else if (!user.isTrainer) {
                        const { dayInfo, isAvailable } = a
                        return filterAppointments(dayInfo, isAvailable)
                      }
                      return <></>
                    })
                    .map((appointment) => {
                      return (
                        <Paper key={appointment._id} sx={{ marginY: 1 }}>
                          <ListItem disableGutters>
                            {user.isTrainer && (
                              <ListItemText
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                }}
                              >
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
                                      appointment.dayInfo > currentDate
                                      ? false
                                      : true
                                    }
                                    onClick={() => {
                                      console.log(appointment.dayInfo, currentDate)
                                      console.log(todayPlus24)
                                      hanldeDelete(appointment._id, user._id)
                                    }}
                                  >
                                    Remove
                                  </Button>
                                )}
                              </ListItemText>
                            )}
                            {!user.isTrainer && (
                              <ListItemText>
                                <Paper
                                  sx={{
                                    width: "auto",
                                    paddingY: 2,
                                    marginX: 1,
                                  }}
                                >
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
                                      disabled={filterMessage ? true : false}
                                      startIcon={<EventAvailableIcon />}
                                    >
                                      {" "}
                                      Book IN
                                    </Button>
                                  ) : (
                                    <LockClockIcon />
                                  )}
                                </Paper>
                              </ListItemText>
                            )}
                          </ListItem>
                        </Paper>
                      )
                    })}
            </ul>
          </List>
        </Paper>
      )}
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
            mt: 1,
          }}
        >
          <span>{appointmentStatus}</span>
        </Grid>
      )}
    </>
  )
}

export default AppointmentsList