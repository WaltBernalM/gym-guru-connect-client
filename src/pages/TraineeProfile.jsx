import { Fragment, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import traineeService from "../services/trainee.service"
import appointmentService from "../services/appointment.service"
import { Box, Button, Container, Divider, Link, List, ListItem, ListItemText, Typography } from "@mui/material"
import NutritionPlanList from "../components/NutritionPlanList"
import ExercisePlanList from "../components/ExercisePlanList"
import { AuthContext } from "../context/auth.context"
import EventBusyIcon from "@mui/icons-material/EventBusy"
import { options, today } from "../utils/constants"

const now = new Date(today)
const twoDaysNow = now.setDate(now.getDate() + 1)

function TraineeProfile() {
  const { traineeId } = useParams()
  const { user } = useContext(AuthContext)

  const [traineeInfo, setTraineeInfo] = useState(null)
  const [traineeAppointments, setTraineeAppointments] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const getTraineeData = async () => {
    try {
      const traineeFromDB = await traineeService.getTrainee(traineeId)
      setTraineeInfo(traineeFromDB.data)
    } catch (error) {
      setErrorMessage(error.response.data.message)
    }
  }

  const getTraineeAppointments = async () => { 
    try {
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
      setErrorMessage(error.response.data.message)
    }
  }

  useEffect(() => {
    getTraineeData()
    getTraineeAppointments()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleUnbook = async (appointmentId, trainerId, traineeId) => {
    try {
      await appointmentService.traineeRemoveAppointment(appointmentId, trainerId, traineeId)
      getTraineeAppointments()
    } catch (error) {
      console.log(error.response.data.message)
    }
  }

  return (
    <div>
      {/* For Trainee */}
      {user &&
        !user.isTrainer &&
        traineeId === user._id &&
        traineeInfo &&
        traineeInfo.nutritionPlan &&
        traineeAppointments && (
          <>
            {/* Trainee Welcome and Schedule */}
            <Box
              sx={{
                bgcolor: "background.paper",
                pt: 2,
                pb: 0,
              }}
            >
              <Container
                maxWidth="sm"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  component="h3"
                  variant="h4"
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
                <List
                  align="center"
                  sx={{
                    width: "100%",
                    // maxWidth: 200,
                    bgcolor: "background.paper",
                    position: "relative",
                    overflow: "auto",
                    maxHeight: 150,
                    "& ul": { padding: 0 },
                    border: "6px solid purple",
                    borderRadius: "10px",
                    mt: 1,
                    display: "flex",
                    flexDirection: "row",
                  }}
                  subheader={<li />}
                >
                  {traineeAppointments.length === 0 && (
                    <ListItem sx={{ textAlign: "center" }} key='empty'>
                      <ListItemText>
                        <Container sx={{display: 'flex', flexDirection: 'column'}}>
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
                  
                  {traineeAppointments.map((appointment) => {
                    return (
                      <Fragment key={appointment._id}>
                        <ListItem
                          sx={{ textAlign: "center" }}
                        >
                          <ListItemText>
                            <Typography>
                              {`${appointment.dayInfo} @ ${appointment.hour}:00`}
                            </Typography>
                            <Typography>
                              <small>with</small>
                              <Link sx={{textDecoration: 'none'}} href={`/trainers/${traineeInfo.trainerId._id}`}>
                                <small>{` ${traineeInfo.trainerId.name.firstName}`}</small>
                              </Link>
                            </Typography>
                            <Button
                              sx={{ textAlign: "center", color: "red", marginTop: 1 }}
                              startIcon={<EventBusyIcon />}
                              disabled={
                                new Date(appointment.dayInfo) > twoDaysNow
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
                      </Fragment>
                    )
                  })}
                </List>
              ) : (
                  <></>
              )}
            </Container>
          </Box>
            {/* Trainee Exercise and Nutrition Plan  */}
            <Box
              sx={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}
            >
              {traineeInfo.trainerId ? (
                <>
                  <Container
                    maxWidth="sm"
                    sx={{
                      backgroundColor: "black",
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
                  <Container
                    maxWidth="sm"
                    sx={{
                      backgroundColor: "black",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "center",
                      marginY: 2,
                    }}
                  >
                    <ExercisePlanList exercisePlan={traineeInfo.exercisePlan} />
                  </Container>
                </>
              ) : (
                <></>
              )}
            </Box>
          </>
        )}

      {/* For Trainer */}
      {user && user.isTrainer && traineeInfo && traineeInfo.nutritionPlan && (
        <>
          <Box sx={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}>
            <Container
              maxWidth="sm"
              sx={{
                backgroundColor: "black",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                marginY: 2,
              }}
            >
              <></>
              <NutritionPlanList
                nutritionPlan={traineeInfo.nutritionPlan}
                traineeId={traineeId}
              />
            </Container>
            <Container
              maxWidth="sm"
              sx={{
                backgroundColor: "black",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                marginY: 2,
              }}
            >
              <ExercisePlanList exercisePlan={traineeInfo.exercisePlan} />
            </Container>
          </Box>
        </>
      )}
    </div>
  )
}


export default TraineeProfile