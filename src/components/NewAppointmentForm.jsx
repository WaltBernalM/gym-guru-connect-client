import { Box, Container, Grid, IconButton, Typography } from "@mui/material"
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
  const { getTrainerSchedule } = props
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
    } catch (error) {
      setAppointmentError(error.response.data.message)
    }
  }

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        pt: 2,
        pb: 2,
        mb: 2,
        border: "6px dotted purple",
        borderRadius: 10,
      }}
    >
      <Typography
        component="h4"
        variant="h6"
        align="center"
        color="text.primary"
        gutterBottom
        mb={2}
      >
        Create a New Consult Window
      </Typography>
      <Container maxWidth="sm" sx={{ display: "flex" }}>
        <DatePicker
          label={"month and day"}
          views={["month", "day"]}
          sx={{ maxWidth: 170, textAlign: "center" }}
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
          <AddBoxIcon fontSize="large" sx={{ color: "green" }} />
        </IconButton>
      </Container>
      {appointmentError && (
        <Grid
          container
          sx={{
            color: "red",
            display: "flex",
            alignItems: "center",
            // flexDirection: "column",
            justifyContent: "center",
            textAlign: "justify",
            mt: 1
          }}
        >
          <ReportProblemOutlinedIcon sx={{mr: 1}}/>
          <span>{appointmentError}</span>
        </Grid>
      )}
    </Box>
  )
}

export default NewAppointmentForm