import {
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  MenuItem,
  TableCell,
  Select,
  Slider,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material"
import { Fragment, useContext, useEffect, useState } from "react"

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import Paper from "@mui/material/Paper"
import { AuthContext } from "../context/auth.context"

import PlusOneIcon from "@mui/icons-material/PlusOne"
import PostAddIcon from "@mui/icons-material/PostAdd"
import BackspaceIcon from "@mui/icons-material/Backspace"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"

import ExerciseRowInfo from "./ExerciseRowInfo"
import exerciseService from "../services/exercise.service"
import exerciseRoutineService from '../services/exerciseRoutine.service'
import ErrorAnimation from "./ErrorAnimation"

const initSwitches = {
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
}

function ExercisePlanList(props) {
  const { exercisePlan: traineeExercisePlan, traineeId, handleAlert, getTraineeData } = props
  const { user } = useContext(AuthContext)
  const [routineIdForExercise, setRoutineIdForExercise] = useState('')
  const [exercisePlan, setExercisePlan] = useState(traineeExercisePlan)
  const [canAddRoutine, setCanAddRoutine] = useState(false)

  const [switches, setSwitches] = useState(initSwitches)

  const [allExercisesDB, setAllExercisesDB] = useState(null)
  const [allExercises, setAllExercises] = useState(null)  

  const [muscleFilter, setMuscleFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [nameFilter, setNameFilter] = useState("")

  const [exerciseChosen, setExerciseChosen] = useState('')
  const [exerciseId, setExerciseId] = useState('')
  const [series, setSeries] = useState(4)
  const [reps, setReps] = useState(12)
  const [intensity, setIntensity] = useState(0.80)

  const [errorAtGatherAllExercise, setErrorAtGatherAllExercise] = useState(false)
  
  const getAllExercises = async () => {
    try {
      setErrorAtGatherAllExercise(false)
      const response = (await exerciseService.getAllExercises()).data
        .allExercises
      setAllExercisesDB(response)
      setAllExercises(response)
    } catch (error) {
      setErrorAtGatherAllExercise(true)
    }
  }

  const handleFilter = (muscle, type, name) => {
    if (!muscle && !type && !name) return setAllExercises(allExercisesDB)

    setAllExercises(
      allExercisesDB.filter((exercise) => {
        const { muscle: muscleDB, type: typeDB, name: nameDB } = exercise
        const nameString = `${name}`.toLowerCase()
        const nameDBString = `${nameDB}`.toLowerCase()
        return (
          (muscle ? muscleDB === muscle : true) &&
          (type ? typeDB === type : true) &&
          (name ? nameDBString.includes(nameString) : true)
        )
      })
    )
  }

  useEffect(() => {
    getAllExercises()
    setExercisePlan(traineeExercisePlan)
    if (exercisePlan.length < 6) {
      setCanAddRoutine(true)
    } else {
      setCanAddRoutine(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createRoutine = async () => {
    try {
      const possibleDays = [1, 2, 3, 4, 5, 6]
      const takenDays = exercisePlan.map(routine => routine.day)
      const availableDayNumbers = possibleDays.filter(number => {
        return takenDays.includes(number) ? false : true
      })
      
      if (availableDayNumbers.length === 1) { 
        setCanAddRoutine(false)
      }
      if (availableDayNumbers.length === 0) return

      const response = (await exerciseRoutineService.addExerciseRoutine(
        availableDayNumbers[0],
        traineeId)).data.updatedExercisePlan
      setExercisePlan(response)
      getTraineeData()
      handleAlert('New routine day added successfully', 'success')
    } catch (error) {
      handleAlert("Something went wrong", "error")
    }
  }

  const deleteRoutine = async (exerciseRoutineId) => {
    try {
      const response = (await exerciseRoutineService.deleteExercise(exerciseRoutineId, traineeId)).data.updatedExercisePlan
      setExercisePlan(response)
      if (response.length < 6) {
        setCanAddRoutine(true)
      }
      getTraineeData()
      handleAlert("Routine day deleted successfully", "success")
    } catch (error) {
      handleAlert("Something went wrong", "error")
    }
  }

  const handleExerciseAssignRoutine = (e) => {
    setRoutineIdForExercise(e.target.value)
  }

  const addExerciseToRoutine = async () => {
    try {
      const response = (await exerciseService.postCustomExerciseToRoutine(
        exerciseId,
        traineeId,
        routineIdForExercise,
        series,
        reps,
        intensity
      )).data.updatedExercisePlan
      setExercisePlan(response)
      getTraineeData()
      handleAlert("Exercise added to routine day successfully", "success")
    } catch (error) {
      handleAlert("Something went wrong", "error")
    }
  }

  const deleteExercise = async (exerciseId) => {
    try {
      const response = (await exerciseService.deleteExercise(exerciseId, traineeId)).data.updatedExercisePlan
      setExercisePlan(response)
      getTraineeData()
      handleAlert("Exercise deleted from routine day successfully", "success")
    } catch (error) {
      handleAlert("Something went wrong", "error")
    }
  }
  
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="collapsible table">
        {/* Routine content editor */}
        <TableHead size="small">
          <TableRow size="small">
            {user && !user.isTrainer && <TableCell />}
            {user && user.isTrainer && (
              <TableCell size="small">
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => createRoutine()}
                  disabled={canAddRoutine ? false : true}
                >
                  <PlusOneIcon sx={{ mr: 1 }} /> <small>{`Day`}</small>
                </Button>
              </TableCell>
            )}
            <TableCell size="small">
              <Typography variant="h6">Exercise Plan</Typography>
            </TableCell>
            {user && user.isTrainer && <TableCell />}
          </TableRow>

          {user && user.isTrainer && (
            <TableRow size="small">
              {/* Exercise Search Fields */}
              <TableCell sx={{ paddingX: 0 }} size="small">
                <Container
                  sx={{
                    m: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    minWidth: 80,
                    maxWidth: 140,
                    marginX: 0,
                  }}
                  variant="outlined"
                  size="small"
                >
                  {/* Exercise Name */}
                  <FormControl sx={{ m: 1, width: 100 }} size="small">
                    <TextField
                      label="Name"
                      value={nameFilter}
                      onChange={(e) => {
                        setNameFilter(e.target.value)
                        handleFilter(muscleFilter, typeFilter, e.target.value)
                      }}
                      size="small"
                    />
                  </FormControl>

                  {/* Exercise's Muscle */}
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
                            return self.slice(0, i).includes(muscle)
                              ? false
                              : true
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

                  {/* Exercise's Type */}
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
                            return self.slice(0, i).includes(muscle)
                              ? false
                              : true
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
              </TableCell>

              {/* Exercise List */}
              <TableCell size="small" sx={{ paddingX: 0, width: '100%' }}>
                <div style={{ width: '100%',display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <List
                    size="small"
                    sx={{
                      minWidth: 80,
                      width: "auto",
                      maxWidth: 400,
                      overflow: "auto",
                      height: 140,
                      border: "1px solid",
                      borderColor: "rgb(0,0,0,0.4)",
                      borderRadius: "10px",
                    }}
                    subheader={<li />}
                  >
                    <li>
                      <ul style={{ padding: 0, minWidth: 180 }}>
                        {/* Exercises list title */}
                        <ListSubheader
                          size="small"
                          sx={{
                            padding: 0,
                            margin: 0,
                            textAlign: "center",
                            height: 40,
                            borderBottom: "1px solid",
                            borderColor: "rgb(0,0,0,0.4)",
                          }}
                        >
                          {exerciseChosen ? (
                            <div
                              style={{
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Typography
                                fontSize={14}
                                padding={1}
                                margin={0}
                                textAlign={"left"}
                              >
                                {exerciseChosen}
                              </Typography>{" "}
                              <FitnessCenterIcon sx={{ fontSize: 14 }} />
                            </div>
                          ) : (
                            "Exercises"
                          )}
                        </ListSubheader>

                        {/* Error if filter finds none */}
                        {allExercises && allExercises.length === 0 && (
                          <ListItem sx={{ paddingY: 0, paddingX: 1 }}>
                            <ListItemText
                              sx={{ color: "red" }}
                              primary={`No matches`}
                            />
                          </ListItem>
                        )}

                        {/* allExercises list render */}
                        {!errorAtGatherAllExercise &&
                          allExercises &&
                          allExercises.map((exercise) => {
                            return (
                              <Fragment key={exercise._id}>
                                <ListItem sx={{ paddingY: 0, paddingX: 1 }}>
                                  <ListItemText>
                                    <Typography
                                      variant="body1"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {`${exercise.name}`}
                                    </Typography>
                                  </ListItemText>
                                  <Button
                                    onClick={() => {
                                      if (exerciseId === exercise._id) {
                                        setExerciseId("")
                                        setExerciseChosen("")
                                      } else {
                                        setExerciseId(exercise._id)
                                        setExerciseChosen(exercise.name)
                                      }
                                    }}
                                    variant="text"
                                    color={
                                      exercise._id === exerciseId
                                        ? "success"
                                        : "primary"
                                    }
                                    size="small"
                                  >
                                    <FitnessCenterIcon />
                                  </Button>
                                </ListItem>
                                <Divider />
                              </Fragment>
                            )
                          })}
                        {errorAtGatherAllExercise && (
                          <>
                            <ListItem
                              sx={{
                                paddingY: 0,
                                paddingX: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <small style={{ color: "red" }}>
                                Please try again later
                              </small>
                              <div style={{ marginTop: 10, width: 40 }}>
                                <ErrorAnimation />
                              </div>
                            </ListItem>
                          </>
                        )}
                      </ul>
                    </li>
                  </List>
                </div>
              </TableCell>

              {/* Customize Exercise to add to Routine */}
              <TableCell
                align="center"
                sx={{
                  maxWidth: 150,
                  paddingX: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                size="small"
              >
                {/* Action button to add to exerciseRoutine */}
                <Button
                  variant="outlined"
                  size="medium"
                  startIcon={<PostAddIcon />}
                  sx={{ marginY: 1 }}
                  disabled={routineIdForExercise ? false : true}
                  onClick={() => addExerciseToRoutine()}
                >
                  Add
                </Button>

                {/* Series slider */}
                <FormControl sx={{ minWidth: 100, marginY: 0 }} size="small">
                  <Container
                    sx={{
                      width: "100%",
                      paddingX: 1,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      id="series-slider"
                      gutterBottom
                      margin={0}
                      marginRight={1.5}
                      fontSize={14}
                      textAlign={"center"}
                    >
                      <small>{`Sets: `}</small>
                    </Typography>
                    <Slider
                      value={series}
                      min={1}
                      step={1}
                      max={10}
                      sx={{ minWidth: 50 }}
                      disabled={exerciseId ? false : true}
                      onChange={(e) => setSeries(e.target.value)}
                      valueLabelDisplay="auto"
                      aria-labelledby="non-linear-slider"
                    />
                    <Typography
                      id="reps-slider"
                      gutterBottom
                      margin={0}
                      marginLeft={1.5}
                      fontSize={14}
                      textAlign={"center"}
                    >
                      <small>{`${series}`}</small>
                    </Typography>
                  </Container>
                </FormControl>

                {/* Reps slider */}
                <FormControl sx={{ minWidth: 100, marginY: 0 }} size="small">
                  <Container
                    sx={{
                      width: "100%",
                      paddingX: 1,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      id="reps-slider"
                      gutterBottom
                      margin={0}
                      marginRight={1.5}
                      fontSize={14}
                      textAlign={"center"}
                    >
                      <small>{`Reps: `}</small>
                    </Typography>
                    <Slider
                      value={reps}
                      min={1}
                      step={1}
                      max={30}
                      disabled={exerciseId ? false : true}
                      sx={{ minWidth: 50 }}
                      onChange={(e) => setReps(e.target.value)}
                      valueLabelDisplay="auto"
                      aria-labelledby="non-linear-slider"
                    />
                    <Typography
                      id="reps-slider"
                      gutterBottom
                      margin={0}
                      marginLeft={1.5}
                      fontSize={14}
                      textAlign={"center"}
                    >
                      <small>{`${reps}`}</small>
                    </Typography>
                  </Container>
                </FormControl>

                {/* Intensity slider */}
                <FormControl sx={{ minWidth: 100, marginY: 0 }} size="small">
                  <Container
                    sx={{
                      width: "100%",
                      paddingX: 1,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      id="intensity-slider"
                      gutterBottom
                      margin={0}
                      marginRight={1.5}
                      fontSize={14}
                      textAlign={"center"}
                    >
                      <small>{`Int: `}</small>
                    </Typography>
                    <Slider
                      value={intensity * 100}
                      min={10}
                      step={5}
                      scale={(intensity) => intensity / 100}
                      max={95}
                      disabled={exerciseId ? false : true}
                      sx={{ minWidth: 50 }}
                      onChange={(e) => setIntensity(e.target.value / 100)}
                      valueLabelDisplay="auto"
                      aria-labelledby="non-linear-slider"
                    />
                    <Typography
                      id="reps-slider"
                      gutterBottom
                      margin={0}
                      marginLeft={1.5}
                      fontSize={14}
                      textAlign={"center"}
                    >
                      <small>{`${intensity}0`.slice(0, 4)}</small>
                    </Typography>
                  </Container>
                </FormControl>

                {/* Select day */}
                <FormControl sx={{ minWidth: 80, marginY: 1 }} size="small">
                  <InputLabel size="small">
                    <small>Day #</small>
                  </InputLabel>
                  <Select
                    value={routineIdForExercise}
                    label="exerciseRoutineAssign"
                    onChange={handleExerciseAssignRoutine}
                    disabled={exerciseId ? false : true}
                    size="small"
                  >
                    <MenuItem value="" key="None" size="small">
                      <em>None</em>
                    </MenuItem>
                    {exercisePlan.map((exerciseRoutine) => {
                      return (
                        exerciseRoutine && (
                          <MenuItem
                            value={exerciseRoutine._id}
                            key={exerciseRoutine._id}
                            size="small"
                          >
                            Day #{exerciseRoutine.day}
                          </MenuItem>
                        )
                      )
                    })}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          )}
        </TableHead>

        {/* Routine and Exercise Editor */}
        <TableBody size="small">
          {exercisePlan.map((exerciseRoutine) => {
            const { _id: routineId, exerciseList, day } = exerciseRoutine
            return (
              exerciseRoutine && (
                <Fragment key={routineId}>
                  <TableRow
                    sx={{ "& > *": { borderBottom: "unset" } }}
                    size="small"
                  >
                    <TableCell size="small">
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() =>
                          setSwitches((prevVal) => ({
                            ...prevVal,
                            [day]: !prevVal[day],
                          }))
                        }
                      >
                        {switches[day] ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row" size="small">
                      day #{exerciseRoutine.day}
                    </TableCell>
                    {user && user.isTrainer && (
                      <TableCell component="th" scope="row" size="small">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<BackspaceIcon />}
                          onClick={() => deleteRoutine(exerciseRoutine._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                  <TableRow key={exerciseRoutine._id}>
                    <TableCell style={{ padding: 0 }} colSpan={6} size="small">
                      <Collapse in={switches[day]} timeout="auto" unmountOnExit>
                        <Box sx={{ marginY: 1 }}>
                          <Table size="small" aria-label="foods">
                            <TableHead>
                              <TableRow>
                                {user && user.isTrainer && (
                                  <TableCell size="small"></TableCell>
                                )}
                                <TableCell size="small">Name</TableCell>
                                <TableCell size="small">Sets</TableCell>
                                <TableCell size="small">Reps.</TableCell>
                                <TableCell size="small">Int.</TableCell>
                                {user && user.isTrainer && (
                                  <TableCell size="small"></TableCell>
                                )}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {user &&
                                !user.isTrainer &&
                                exerciseList.map((exercise) => {
                                  return (
                                    <TableRow key={exercise._id} size="small">
                                      <TableCell
                                        component="th"
                                        scope="row"
                                        size="small"
                                      >
                                        {exercise.exerciseData.name}
                                      </TableCell>
                                      <TableCell
                                        component="th"
                                        scope="row"
                                        size="small"
                                      >
                                        {exercise.series}
                                      </TableCell>
                                      <TableCell
                                        component="th"
                                        scope="row"
                                        size="small"
                                      >
                                        {exercise.reps}
                                      </TableCell>
                                      <TableCell
                                        component="th"
                                        scope="row"
                                        size="small"
                                      >
                                        {exercise.intensity}
                                      </TableCell>
                                    </TableRow>
                                  )
                                })}
                              {user &&
                                user.isTrainer &&
                                exerciseList.map((exercise) => {
                                  return (
                                    <ExerciseRowInfo
                                      key={exercise._id}
                                      exerciseId={exercise._id}
                                      traineeId={traineeId}
                                      routineId={routineId}
                                      deleteExercise={deleteExercise}
                                      handleAlert={handleAlert}
                                    />
                                  )
                                })}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
              )
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ExercisePlanList
