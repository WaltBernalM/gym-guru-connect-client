import { useState, useEffect } from "react"
import exerciseService from "../services/exercise.service"
import { Box, Button, Card, CardActions, CardContent, Container, Fade, FormControl, Grow, InputLabel, MenuItem, Modal, Select, Slide, TextField, Typography, useMediaQuery } from "@mui/material"

import ReadMoreIcon from "@mui/icons-material/ReadMore"
import ExerciseAnimation1 from "../components/ExerciseAnimation1"
import ExerciseAnimation2 from "../components/ExerciseAnimation2"
import ServerErrorAnimation from "../components/ServerErrorAnimation"

function ExerciseCard(props) {
  let { exercise, handleSetModalInstructions, handleOpen } = props

  let { name, muscle, type, instructions } = exercise
  if (muscle === "middle_back") muscle = "middle back"
  else if (muscle === "lower_back") muscle = "lower back"
  if (type === "olympic_weightlifting") type = "olympic weightlifting"
  
  return (
    <Card
      sx={{
        fontSize: 14,
        maxWidth: "auto",
        minHeight: 260,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {muscle.slice(0, 1).toUpperCase() + muscle.slice(1)}
        </Typography>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {type}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'center'}}>
        <Button
          startIcon={<ReadMoreIcon />}
          variant="contained"
          onClick={() => {
            handleOpen()
            handleSetModalInstructions({ name, instructions })
          }}
          sx={{ mb: 1 }}
        >
          Instructions
        </Button>
      </CardActions>
    </Card>
  )
}

function ExercisesPage() {
  // const { user } = useContext(AuthContext)
  const [allExercisesDB, setAllExercisesDB] = useState(null)
  const [allExercises, setAllExercises] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [modalInstructions, setModalInstructions] = useState({ name: '', instructions: '' })
  
  const [muscleFilter, setMuscleFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [nameFilter, setNameFilter] = useState("")

  const [error, setError] = useState(false)

  const getAllExercises = async () => {
    try {
      const response = (await exerciseService.getAllExercises()).data.allExercises
      setAllExercisesDB(response)
      setAllExercises(response)
    } catch (error) {
      setError(true)
    }
  }

  useEffect(() => {
    getAllExercises()
  }, [])

  const handleOpen = () => setIsVisible(true)
  const handleClose = () => setIsVisible(false)
  const handleSetModalInstructions = (instructions) => setModalInstructions(instructions)

  const handleFilter = (muscle, type, name) => {
    if (!muscle && !type && !name) return setAllExercises(allExercisesDB)

    setAllExercises(allExercisesDB.filter(exercise => {
      const { muscle: muscleDB, type: typeDB, name: nameDB } = exercise
      const nameString = `${name}`.toLowerCase()
      const nameDBString = `${nameDB}`.toLowerCase()
      return (
        (muscle ? muscleDB === muscle : true) &&
        (type ? typeDB === type : true) &&
        (name ? nameDBString.includes(nameString) : true)
      )
    }))
  }

  const isSmallScreen = useMediaQuery("(max-width:600px)")
  const isAvailable = isSmallScreen ? false : true

  return (
    <>
      {!error && (
        <Box sx={{ width: "100%", height: "auto", overflowY: "scroll" }}>
          {isAvailable && (
            <Grow
              in={isAvailable}
              style={{ transformOrigin: "0 0 0" }}
              {...(isAvailable ? { timeout: 1000 } : {})}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{ width: "40%", display: "flex" }}
                  align="center"
                  justifyContent={"center"}
                  component="h4"
                  variant="h5"
                  color="text.primary"
                >
                  Browse our exercises!
                </Typography>
                <Container sx={{ width: "40%", display: "flex" }}>
                  <ExerciseAnimation1 />
                  <ExerciseAnimation2 />
                </Container>
              </div>
            </Grow>
          )}
          <Fade in={allExercises ? true : false}>
            <Container
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              {/* Muscle filter */}
              <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
                <InputLabel id="demo-select-small-label">Muscle</InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={muscleFilter}
                  label="Muscle"
                  onChange={(e) => {
                    setMuscleFilter(e.target.value)
                    handleFilter(e.target.value, typeFilter, nameFilter)
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {allExercisesDB &&
                    allExercisesDB
                      .map((exercise) => exercise.muscle)
                      .filter((muscle, i, self) => {
                        return self.slice(0, i).includes(muscle) ? false : true
                      })
                      .map((muscle, i) => (
                        <MenuItem value={muscle} key={muscle + i}>
                          <em>
                            {muscle === "lower_back"
                              ? "lower back"
                              : muscle === "middle_back"
                              ? "middle back"
                              : muscle}
                          </em>
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>

              {/* Text Input  */}
              <TextField
                label="Name"
                value={nameFilter}
                onChange={(e) => {
                  setNameFilter(e.target.value)
                  handleFilter(muscleFilter, typeFilter, e.target.value)
                }}
                size="small"
              />

              {/* Type filter */}
              <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
                <InputLabel id="demo-select-small-label">Type</InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={typeFilter}
                  label="Type"
                  onChange={(e) => {
                    setTypeFilter(e.target.value)
                    handleFilter(muscleFilter, e.target.value, nameFilter)
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {allExercisesDB &&
                    allExercisesDB
                      .map((exercise) => exercise.type)
                      .filter((muscle, i, self) => {
                        return self.slice(0, i).includes(muscle) ? false : true
                      })
                      .map((type, i) => (
                        <MenuItem value={type} key={type + i}>
                          <em>
                            {type === "olympic_weightlifting"
                              ? "olympic weightlifting"
                              : type}
                          </em>
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
            </Container>
          </Fade>

          {allExercises && (
            <Slide
              in={allExercises ? true : false}
              direction="up"
              mountOnEnter
              unmountOnExit
            >
              <div>
                <Container
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                    gridGap: "20px",
                    mt: 2,
                  }}
                >
                  {allExercises &&
                    allExercises.map((exercise) => (
                      <ExerciseCard
                        key={exercise._id}
                        exercise={exercise}
                        handleOpen={handleOpen}
                        handleSetModalInstructions={handleSetModalInstructions}
                      />
                    ))}
                </Container>
              </div>
            </Slide>
          )}
          <Modal
            open={isVisible}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "70vw",
                height: "70vh",
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                overflowY: "scroll",
                p: 4,
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {modalInstructions.name}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <b>Execution: </b>
                {modalInstructions.instructions}
              </Typography>
            </Box>
          </Modal>
        </Box>
      )}

      {error && (
        <div style={{ height: "90vh", display: "flex", alignItems: "center" }}>
          <ServerErrorAnimation />
        </div>
      )}
    </>
  )
}

export default ExercisesPage