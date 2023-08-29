import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import traineeService from "../services/trainee.service"
import appointmentService from "../services/appointment.service"
import { Box, Container, Typography } from "@mui/material"
import NutritionPlanList from "../components/NutritionPlanList"
import ExercisePlanList from "../components/ExercisePlanList"


function TraineeProfile() {
  const { traineeId } = useParams()
  const [traineeInfo, setTraineeInfo] = useState(null)
  const [traineeAppointments, setTraineeAppointments] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const getTrainee = async () => {
    try {
      const traineeFromDB = await traineeService.getTrainee(traineeId)
      setTraineeInfo(traineeFromDB.data)

      const traineeAppointmentsFromDB = await appointmentService.getAllAppointmentsOfTrainee(traineeId)
      setTraineeAppointments(traineeAppointmentsFromDB.data)
    } catch (error) {
      setErrorMessage(error.response.data.message)
    }
  }

  useEffect(() => {
    getTrainee()
  }, [])

  return (
    traineeInfo &&
    traineeInfo.nutritionPlan && (
      <div>
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 2,
            pb: 0,
          }}
        >
          <Container maxWidth="sm">
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
          </Container>
        </Box>

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
            <NutritionPlanList nutritionPlan={traineeInfo.nutritionPlan} />
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
      </div>
    )
  )
}


export default TraineeProfile