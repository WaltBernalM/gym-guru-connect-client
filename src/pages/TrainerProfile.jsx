import { Fragment, useContext, useEffect, useState } from "react"
import { useParams } from 'react-router-dom'
import trainerService from "../services/trainer.service"
import { Alert, Box, Button, ButtonGroup, Container, Grid, Grow, IconButton, Slide, Snackbar, Stack, Typography, useMediaQuery } from "@mui/material"
import { AuthContext } from "../context/auth.context"

import PersonAddIcon from "@mui/icons-material/PersonAdd"
import appointmentService from "../services/appointment.service"
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined"

import NewAppointmentForm from "../components/NewAppointmentForm"
import AppointmentsList from "../components/AppointmentsList"
import CoachAnimation from "../components/CoachAnimation"
import TraineesList from "../components/TraineesList"
import ScheduleAnimation from "../components/ScheduleAnimation"
import TraineesAnimation from "../components/TraineesAnimation"
import NewAppointmentAnimation from "../components/NewAppointmentAnimation"
import ServerErrorAnimation from "../components/ServerErrorAnimation"

function TrainerProfile() {
  const [trainerInfo, setTrainerInfo] = useState(null)
  const [trainerSchedule, setTrainerSchedule] = useState(null)
  const [appointmentStatus, setAppointmentStatus] = useState('')
  const { trainerId } = useParams()
  const { user } = useContext(AuthContext)
  const [coachAssignError, setCoachAssignError] = useState(null)

  const [seeTrainees, setSeeTrainees] = useState(false)
  const [seeAppointments, setSeeAppointments] = useState(false)
  const [seeAddForm, setSeeAddForm] = useState(false)

  const [error, setError] = useState(false)

  const getTrainer = async () => {
    try {
      setError(false)
      const trainerFromDB = await trainerService.getTrainerInfo(trainerId)
      setTrainerInfo(trainerFromDB.data)
      if (!user.isTrainer && trainerFromDB.data.trainees.includes(user._id)) {
        getTrainerSchedule()
      } else if (user.isTrainer && trainerFromDB) {
        getTrainerSchedule()
      }
    } catch (error) {
      setAppointmentStatus(error.response.data.message)
      setError(true)
    }
  }
  
  const getTrainerSchedule = async () => {
    try {
      setError(false)
      const scheduleFromDB =
        await appointmentService.getAppointmentsForTrainer(trainerId)
      setTrainerSchedule(scheduleFromDB.data)
    } catch (error) {
      setAppointmentStatus(error.response.data.message)
      setError(true)
    }
  }

  const [alertMessage, setAlertMessage] = useState("")
  const [alertSeverity, setAlertSeverity] = useState("info")
  const [open, setOpen] = useState(false)
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpen(false)
  }
  const handleAlert = (message, severity) => {
    setOpen(true)
    setAlertMessage(message)
    setAlertSeverity(severity)
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
      handleAlert('New coach assigned', 'success')
    } catch (error) {
      setCoachAssignError(error.response.data.message)
      handleAlert('Something went wrong', 'error')
    }
  }

  const isSmallScreen = useMediaQuery("(max-width:600px)")
  const coachAnimWidth = isSmallScreen ? "10px" : "20%"

  const switchButtonsController = (section) => {
    if (section === 'addAppointmentForm') {
      setSeeTrainees(false)
      setSeeAppointments(false)
      setTimeout(() => {setSeeAddForm(!seeAddForm)},500)
    } else if (section === 'traineesList') { 
      setSeeAddForm(false)
      setSeeAppointments(false)
      setTimeout(() => {setSeeTrainees(!seeTrainees)}, 500) 
    } else if (section === 'scheduleList') {
      setSeeAddForm(false)
      setSeeTrainees(false)
      setTimeout(() => {
        setSeeAppointments(!seeAppointments)
      }, user.isTrainer ? 500 : 0)
    }
  }
  
  return (
    <>
      {!error && (
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
            <Snackbar
              open={open}
              onClose={handleClose}
              autoHideDuration={4000}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert severity={alertSeverity}>{alertMessage}</Alert>
            </Snackbar>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Container sx={{ width: `${coachAnimWidth}`, margin: 0 }}>
                <CoachAnimation />
              </Container>
              {!isSmallScreen &&
                trainerInfo &&
                user &&
                user._id === trainerInfo._id && (
                  <Typography
                    component="h4"
                    variant="h5"
                    align="center"
                    color="text.primary"
                    gutterBottom
                  >
                    Welcome <br /> {trainerInfo.name.firstName}{" "}
                    {trainerInfo.name.lastName}
                  </Typography>
                )}
              {!isSmallScreen && user && !user.isTrainer && trainerInfo && (
                <Container sx={{ width: "30%", margin: 0, padding: 0 }}>
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
                    paddingBottom={0}
                    marginBottom={0}
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
              )}
            </div>
            {/* For Trainee */}
            {trainerInfo && user && !user.isTrainer && (
              <Fragment>
                <Box
                  sx={{
                    bgcolor: "background.paper",
                    pt: 0,
                    mt: 0,
                    pb: 0,
                  }}
                >
                  {isSmallScreen && (
                    <Container maxWidth="sm">
                      <Typography
                        component="h5"
                        variant="h6"
                        align="center"
                        color="text.primary"
                      >
                        {trainerInfo.name.firstName} {trainerInfo.name.lastName}
                      </Typography>
                      <Typography
                        variant="p"
                        align="center"
                        color="text.secondary"
                        paragraph
                        paddingBottom={0}
                        marginBottom={0}
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
                  )}
                </Box>

                {trainerInfo && trainerInfo.trainees.includes(user._id) && (
                  <Box>
                    <Container
                      sx={{
                        width: 130,
                        margin: 0,
                        padding: 0,
                        marginBottom: 0,
                        paddingBottom: 1,
                      }}
                    >
                      <IconButton
                        onClick={() => switchButtonsController("scheduleList")}
                      >
                        <ScheduleAnimation />
                      </IconButton>
                    </Container>
                  </Box>
                )}

                {user && trainerSchedule && trainerSchedule.schedule && (
                  <Slide
                    direction="up"
                    in={seeAppointments}
                    mountOnEnter
                    unmountOnExit
                  >
                    <div style={{ width: "auto" }}>
                      <AppointmentsList
                        trainerSchedule={trainerSchedule}
                        trainerInfo={trainerInfo}
                        handleAlert={handleAlert}
                      />
                    </div>
                  </Slide>
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
              </Fragment>
            )}

            {/* For Trainer */}
            {trainerInfo && user && user._id === trainerInfo._id && (
              <Fragment>
                {/* Welcome message */}
                <Box
                  sx={{
                    bgcolor: "background.paper",
                    pt: 0,
                    pb: 0,
                  }}
                >
                  <Container maxWidth="sm">
                    {isSmallScreen && (
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
                    )}
                  </Container>
                </Box>

                {/* Buttons */}
                <Box sx={{ width: "100%" }}>
                  <ButtonGroup
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Container
                      sx={{
                        width: 130,
                        margin: 0,
                        padding: 0,
                        marginBottom: 1,
                      }}
                    >
                      <IconButton
                        sx={{ padding: 0 }}
                        onClick={() =>
                          switchButtonsController("addAppointmentForm")
                        }
                      >
                        <NewAppointmentAnimation />
                      </IconButton>
                    </Container>
                    <Container
                      sx={{
                        width: 130,
                        margin: 0,
                        padding: 0,
                        marginBottom: 1,
                      }}
                    >
                      <IconButton
                        sx={{ padding: 0 }}
                        onClick={() => switchButtonsController("traineesList")}
                      >
                        <TraineesAnimation />
                      </IconButton>
                    </Container>
                    <Container
                      sx={{
                        width: 130,
                        margin: 0,
                        padding: 0,
                        marginBottom: 1,
                      }}
                    >
                      <IconButton
                        sx={{ padding: 0 }}
                        onClick={() => switchButtonsController("scheduleList")}
                      >
                        <ScheduleAnimation />
                      </IconButton>
                    </Container>
                  </ButtonGroup>
                </Box>

                <Box
                  display={"flex"}
                  flexWrap={"wrap"}
                  justifyContent={"space-around"}
                  width={"100%"}
                >
                  {user &&
                    user.isTrainer &&
                    trainerSchedule &&
                    trainerSchedule.schedule && (
                      <div style={{ width: "auto" }}>
                        <Slide
                          direction="up"
                          in={seeAddForm}
                          mountOnEnter
                          unmountOnExit
                        >
                          <div style={{ width: "auto" }}>
                            <NewAppointmentForm
                              getTrainerSchedule={getTrainerSchedule}
                              handleAlert={handleAlert}
                            />
                          </div>
                        </Slide>

                        <Slide
                          direction="up"
                          in={seeTrainees}
                          mountOnEnter
                          unmountOnExit
                        >
                          <div style={{ width: "auto" }}>
                            <TraineesList trainees={trainerInfo.trainees} />
                          </div>
                        </Slide>
                        <Slide
                          direction="up"
                          in={seeAppointments}
                          mountOnEnter
                          unmountOnExit
                        >
                          <div style={{ width: "auto" }}>
                            <AppointmentsList
                              trainerSchedule={trainerSchedule}
                              trainerInfo={trainerInfo}
                              handleAlert={handleAlert}
                            />
                          </div>
                        </Slide>
                      </div>
                    )}
                </Box>
              </Fragment>
            )}
          </div>
        </Grow>
      )}
      {error && (
        <div style={{ height: "90vh", display: "flex", alignItems: "center" }}>
          <ServerErrorAnimation />
        </div>
      )}
    </>
  )
}

export default TrainerProfile
