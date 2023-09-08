import { Fragment, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import traineeService from "../services/trainee.service"
import appointmentService from "../services/appointment.service"
import { Box, Button, Container, Divider, Grow, IconButton, Link, List, ListItem, ListItemText, Paper, Tab, Typography } from "@mui/material"
import NutritionPlanList from "../components/NutritionPlanList"
import ExercisePlanList from "../components/ExercisePlanList"
import { AuthContext } from "../context/auth.context"
import EventBusyIcon from "@mui/icons-material/EventBusy"
import { options, today } from "../utils/constants"
import { TabContext, TabList, TabPanel } from "@mui/lab"
import CalendarAnimation from "../components/CalendarAnimation"
import ServerErrorAnimation from "../components/ServerErrorAnimation"

const now = new Date(today)
const twoDaysNow = now.setDate(now.getDate() + 1)

function TraineeProfile() {
  const { traineeId } = useParams()
  const { user } = useContext(AuthContext)

  const [traineeInfo, setTraineeInfo] = useState(null)
  const [traineeAppointments, setTraineeAppointments] = useState(null)
  const [error, setError] = useState(false)

  const [tabNumber, setTabNumber] = useState("1")
  const [showAppointments, setShowAppointments] = useState(false)

  const getTraineeData = async () => {
    try {
      setError(false)
      const traineeFromDB = await traineeService.getTrainee(traineeId)
      setTraineeInfo(traineeFromDB.data)
    } catch (error) {
      setError(true)
    }
  }

  const getTraineeAppointments = async () => { 
    try {
      setError(false)
      if (user && !user.isTrainer){
      const traineeAppointmentsFromDB = (
        await appointmentService.getAllAppointmentsOfTrainee(traineeId)
      ).data.filter((a) => {
        const dateInAppointment = new Date(a.dayInfo).toLocaleString(
          "en-US",
          options
        )
        return new Date(dateInAppointment) >= today ? true : false
      })
      setTraineeAppointments(traineeAppointmentsFromDB)}
    } catch (error) {
      setError(true)
    }
  }

  useEffect(() => {
    getTraineeData()
    getTraineeAppointments()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleUnbook = async (appointmentId, trainerId, traineeId) => {
    try {
      setError(false)
      await appointmentService.traineeRemoveAppointment(appointmentId, trainerId, traineeId)
      getTraineeAppointments()
    } catch (error) {
      setError(true)
    }
  }

  const handleTabsChange = (event, newValue) => {
    setTabNumber(newValue)
  }

  return (
    <>
      {!error && (
        <div>
          {/* For Trainee */}
          {user &&
            !user.isTrainer &&
            traineeId === user._id &&
            traineeInfo &&
            traineeInfo.nutritionPlan &&
            traineeAppointments && (
              <Grow
                in={!user.isTrainer}
                style={{ transformOrigin: "0 0 0" }}
                {...(!user.isTrainer ? { timeout: 1000 } : {})}
              >
                <div>
                  {/* Trainee Welcome and Schedule */}
                  <Box
                    sx={{
                      bgcolor: "background.paper",
                      pt: 1,
                      pb: 0,
                    }}
                  >
                    <Container
                      maxWidth="md"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        component="h5"
                        variant="h6"
                        align="center"
                        color="text.primary"
                        gutterBottom
                      >
                        Welcome <br /> {traineeInfo.name.firstName}{" "}
                        {traineeInfo.name.lastName}
                      </Typography>
                      <Typography align="center">
                        <small>
                          {traineeInfo.trainerId ? (
                            <>
                              Your current trainer is
                              <span>
                                {` ${traineeInfo.trainerId.name.firstName} ${traineeInfo.trainerId.name.lastName}`}
                              </span>
                            </>
                          ) : (
                            "You have no trainer yet"
                          )}
                        </small>
                      </Typography>

                      {/* Trainee appointments */}
                      {traineeInfo.trainerId ? (
                        <Paper
                          elevation={3}
                          sx={{
                            marginTop: 1,
                            paddingTop: 1,
                            width: "auto",
                            maxWidth: "70%",
                            border: "1px rgba(0,0,0,0.1)",
                            borderStyle: "ridge",
                            borderRadius: "10px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              width: "30%",
                              maxWidth: 120,
                              minWidth: 90,
                              textAlign: "center",
                            }}
                          >
                            <IconButton
                              sx={{ marginBottom: 1 }}
                              onClick={() => {
                                setShowAppointments(!showAppointments)
                              }}
                            >
                              <CalendarAnimation />
                            </IconButton>
                            {showAppointments && (
                              <Grow
                                in={showAppointments}
                                style={{ transformOrigin: "0 0 0" }}
                                {...(showAppointments ? { timeout: 1000 } : {})}
                              >
                                <small style={{ fontSize: 10 }}>
                                  Next appointments
                                </small>
                              </Grow>
                            )}
                          </div>

                          {showAppointments && (
                            <Grow
                              in={showAppointments}
                              style={{ transformOrigin: "0 0 0" }}
                              {...(showAppointments ? { timeout: 1000 } : {})}
                            >
                              <List
                                sx={{
                                  width: "auto",
                                  maxWidth: "100%",
                                  bgcolor: "background.paper",
                                  position: "relative",
                                  overflow: "auto",
                                  maxHeight: "auto",
                                  "& ul": { padding: 0 },
                                  mt: 0,
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                                subheader={<li />}
                              >
                                {/* If there's no appiontments */}
                                {traineeAppointments.length === 0 && (
                                  <ListItem
                                    sx={{ textAlign: "center" }}
                                    key="empty"
                                  >
                                    <ListItemText>
                                      <Container
                                        sx={{
                                          display: "flex",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <small>You have no appointments</small>
                                        <Button
                                          href={`/trainers/${traineeInfo.trainerId._id}`}
                                        >
                                          Book a new Appointment
                                        </Button>
                                      </Container>
                                    </ListItemText>
                                  </ListItem>
                                )}
                                {traineeAppointments.map((appointment, i) => {
                                  return (
                                    <Paper
                                      key={appointment._id}
                                      sx={{ margin: 1.5, marginBottom: 0 }}
                                      elevation={1}
                                    >
                                      <ListItem sx={{ textAlign: "center" }}>
                                        <ListItemText>
                                          <Typography>
                                            {`${appointment.dayInfo} @ ${appointment.hour}:00`}
                                          </Typography>
                                          <Typography>
                                            <small>with</small>
                                            <Link
                                              sx={{ textDecoration: "none" }}
                                              href={`/trainers/${traineeInfo.trainerId._id}`}
                                            >
                                              <small>{` ${traineeInfo.trainerId.name.firstName}`}</small>
                                            </Link>
                                          </Typography>
                                          <Button
                                            sx={{
                                              textAlign: "center",
                                              color: "red",
                                              marginTop: 1,
                                            }}
                                            startIcon={<EventBusyIcon />}
                                            disabled={
                                              new Date(appointment.dayInfo) >
                                              twoDaysNow
                                                ? false
                                                : true
                                            }
                                            onClick={() =>
                                              handleUnbook(
                                                appointment._id,
                                                traineeInfo.trainerId._id,
                                                user._id
                                              )
                                            }
                                          >
                                            Unbook
                                          </Button>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider
                                        orientation="vertical"
                                        flexItem
                                      />
                                    </Paper>
                                  )
                                })}
                              </List>
                            </Grow>
                          )}
                        </Paper>
                      ) : (
                        <></>
                      )}
                    </Container>
                  </Box>

                  {/* Trainee Exercise and Nutrition Plan  */}
                  <Box
                    sx={{
                      width: "100%",
                      typography: "body1",
                      textAlign: "center",
                    }}
                  >
                    <TabContext value={tabNumber}>
                      <Box
                        sx={{
                          borderBottom: 1,
                          borderColor: "divider",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TabList onChange={handleTabsChange}>
                          <Tab label="Nutrition Plan" value="1" />
                          <Tab label="Exercise Plan" value="2" />
                        </TabList>
                      </Box>

                      {/* Tab for Nutrition Plan */}
                      <TabPanel value="1" sx={{ paddingX: 0 }}>
                        {traineeInfo.trainerId &&
                          traineeInfo.nutritionPlan.length > 0 && (
                            <Container
                              maxWidth="sm"
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                marginY: 2,
                              }}
                            >
                              <NutritionPlanList
                                nutritionPlan={traineeInfo.nutritionPlan}
                              />
                            </Container>
                          )}
                      </TabPanel>

                      {/* Tab for Exercise Plan */}
                      <TabPanel value="2" sx={{ paddingX: 0 }}>
                        {traineeInfo.trainerId &&
                          traineeInfo.exercisePlan.length > 0 && (
                            <Container
                              maxWidth="sm"
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                marginY: 2,
                              }}
                            >
                              <ExercisePlanList
                                exercisePlan={traineeInfo.exercisePlan}
                              />
                            </Container>
                          )}
                      </TabPanel>
                    </TabContext>
                  </Box>
                </div>
              </Grow>
            )}

          {/* For Trainer */}
          {user &&
            user.isTrainer &&
            traineeInfo &&
            traineeInfo.nutritionPlan && (
              <Grow
                in={user.isTrainer}
                style={{ transformOrigin: "0 0 0" }}
                {...(user.isTrainer ? { timeout: 1000 } : {})}
              >
                <div>
                  <Box
                    sx={{
                      bgcolor: "background.paper",
                      pt: 1,
                      pb: 0,
                    }}
                  >
                    <Container
                      maxWidth="md"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        component="h5"
                        variant="h6"
                        align="center"
                        color="text.primary"
                        gutterBottom
                      >
                        {traineeInfo.name.firstName}{" "}
                        {traineeInfo.name.lastName}'s plan
                      </Typography>
                    </Container>
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      typography: "body1",
                      textAlign: "center",
                    }}
                  >
                    <TabContext value={tabNumber} sx={{ padding: 0 }}>
                      <Box
                        sx={{
                          borderBottom: 1,
                          borderColor: "divider",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TabList onChange={handleTabsChange}>
                          <Tab label="Nutrition Plan" value="1" />
                          <Tab label="Exercise Plan" value="2" />
                        </TabList>
                      </Box>

                      {/* Tab for Nutrition Plan */}
                      <TabPanel value="1" sx={{ padding: 0 }}>
                        <Container
                          maxWidth="sm"
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "center",
                            marginY: 2,
                            padding: 0,
                          }}
                        >
                          <NutritionPlanList
                            nutritionPlan={traineeInfo.nutritionPlan}
                            traineeId={traineeId}
                          />
                        </Container>
                      </TabPanel>

                      {/* Tab for Exercise Plan */}
                      <TabPanel value="2" sx={{ padding: 0 }}>
                        <Container
                          maxWidth="sm"
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "center",
                            marginY: 2,
                            padding: 0,
                          }}
                        >
                          <ExercisePlanList
                            exercisePlan={traineeInfo.exercisePlan}
                            traineeId={traineeId}
                          />
                        </Container>
                      </TabPanel>
                    </TabContext>
                  </Box>
                </div>
              </Grow>
            )}
        </div>
      )}
      {error && (
        <div style={{ height: "90vh", display: "flex", alignItems: "center" }}>
          <ServerErrorAnimation />
        </div>
      )}
    </>
  )
}


export default TraineeProfile