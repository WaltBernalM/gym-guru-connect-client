import { Button, Link, List, ListItem, ListItemText, ListSubheader } from "@mui/material"

import EventBusyIcon from "@mui/icons-material/EventBusy"
import PersonSearchIcon from "@mui/icons-material/PersonSearch"
import { AuthContext } from "../context/auth.context"
import { useContext } from "react"

function AppointmentsList(props) {
  const { trainerSchedule, deleteAppointment } = props
  const { user } = useContext(AuthContext)

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 500,
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
        <ListSubheader>My Schedule</ListSubheader>
        {user && user.isTrainer && trainerSchedule && trainerSchedule.schedule
          .filter(a => new Date() > new Date(a.dayInfo) ? false : true)
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
                      onClick={() => deleteAppointment(appointment._id, user._id)}
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
  )
}

export default AppointmentsList