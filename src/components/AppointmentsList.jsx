import { Button, Grid, List, ListItem, ListItemText, ListSubheader, } from "@mui/material"

import EventBusyIcon from "@mui/icons-material/EventBusy"
import PersonSearchIcon from "@mui/icons-material/PersonSearch"
import { AuthContext } from "../context/auth.context"
import { useContext, useEffect, useState } from "react"

import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined"

import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import dayjs from "dayjs"
import appointmentService from "../services/appointment.service"

function AppointmentsList(props) {
  const { trainerSchedule } = props
  const { user } = useContext(AuthContext)
  
  const [dateFilter, setDateFilter] = useState(null)
  const [filterMessage, setFilterMessage] = useState(null)
  const [filtered, setFiltered] = useState(trainerSchedule.schedule)
  
  const [deletionError, setDeletionError] = useState(null)

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
      console.log(error.response.data.message)
      setDeletionError(error.response.data.message)
    }
  }
  
  return (
    <>
      <List
        sx={{
          width: "100%",
          maxWidth: 500,
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
                  filterMessage
                    ? <span style={{ color: 'red' }}>
                        {filterMessage}
                      </span>
                    : "Date Filter"
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
          {
            filtered.filter((a) => {
              const dateInAppointment = new Date(a.dayInfo).toLocaleString(
                "en-US",
                options
              )
              return new Date(dateInAppointment) >= today ? true : false
            })
            .map((appointment) => {
              return (
                <ListItem
                  key={appointment._id}
                  disableGutters
                  sx={{ textAlign: "center" }}
                >
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
                        disabled={ new Date (appointment.dayInfo) > new Date(today) ? false : true}
                        onClick={() => hanldeDelete(appointment._id, user._id)}
                      >
                        Remove
                      </Button>
                    )}
                  </ListItemText>
                </ListItem>
              )
            })}
        </ul>
      </List>

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
    </>
  )
}

export default AppointmentsList