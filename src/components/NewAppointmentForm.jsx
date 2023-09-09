import { Box, Container, Grid, Grow, IconButton, Paper, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import { SingleInputTimeRangeField } from "@mui/x-date-pickers-pro/SingleInputTimeRangeField"
import AddBoxIcon from "@mui/icons-material/AddBox"
import dayjs from "dayjs"
import { useContext, useState } from "react"
import { AuthContext } from "../context/auth.context"
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined"
import appointmentService from "../services/appointment.service"

const initialHours = [dayjs("2022-04-07T07:00"), dayjs("2022-04-17T19:00")]
const initialDay = dayjs().add(48, "hour")

function NewAppointmentForm(props) {
  const { getTrainerSchedule, handleAlert } = props
  const { user } = useContext(AuthContext)

  const [hourRange, setHourRange] = useState(() => initialHours)
  const [date, setDate] = useState(initialDay)
  const [appointmentError, setAppointmentError] = useState(null)

  const handleCreation = async (trainerId) => {
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
      getTrainerSchedule()
      handleAlert('New appointment(s) added', 'success')
    } catch (error) {
      handleAlert(error.response.data.message, 'error')
    }
  }

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        pt: 0,
        pb: 0,
        mb: 2,
        mt: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Paper
        sx={{ textAlign: "center", paddingBottom: 1, marginX: 3 }}
        elevation={5}
      >
        <Typography
          component="h5"
          variant="h6"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ maxWidth: "100%" }}
          mt={1}
          mb={1}
        >
          Create a New Consult Window
        </Typography>
        <Container maxWidth="sm">
          <DatePicker
            label={"month and day"}
            sx={{
              maxWidth: 200,
              width: "44%",
              padding: 0,
              margin: 0,
              marginRight: 0.4,
            }}
            views={["month", "day"]}
            value={date}
            onChange={(newValue) => setDate(newValue)}
          />
          <SingleInputTimeRangeField
            label="Hour Range"
            value={hourRange}
            onChange={(newValue) => setHourRange(newValue)}
            minTime={dayjs("T07:00")}
            minutesStep={60}
            ampm={false}
            sx={{ maxWidth: 130, textAlign: "center" }}
          />
          <IconButton onClick={() => handleCreation(user._id)}>
            <AddBoxIcon fontSize="large" color="info" />
          </IconButton>
        </Container>
        {appointmentError && (
          <Grow
            in={appointmentError}
            style={{ transformOrigin: "0 0 0" }}
            {...(appointmentError ? { timeout: 1000 } : {})}
          >
            <Grid
              container
              sx={{
                color: "red",
                display: "flex",
                alignItems: "center",
                // flexDirection: "column",
                justifyContent: "center",
                textAlign: "justify",
                mt: 1,
              }}
            >
              <ReportProblemOutlinedIcon sx={{ mr: 1 }} />
              <small>{appointmentError}</small>
            </Grid>
          </Grow>
        )}
      </Paper>
    </Box>
  )
}

export default NewAppointmentForm