import { Box, Container, Grid, IconButton, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import { SingleInputTimeRangeField } from "@mui/x-date-pickers-pro/SingleInputTimeRangeField"
import AddBoxIcon from "@mui/icons-material/AddBox"
import dayjs from "dayjs"
import { useContext } from "react"
import { AuthContext } from "../context/auth.context"
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined"

function NewAppointmentForm(props) {
  const { day, hourRange, setDay, setHourRange, handleCreateBooks, appointmentError } = props
  const { user } = useContext(AuthContext)

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
          value={day}
          onChange={(newValue) => setDay(newValue)}
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
        <IconButton onClick={() => handleCreateBooks(user._id)}>
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