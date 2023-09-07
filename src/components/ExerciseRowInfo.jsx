import { useEffect, useState } from "react"
import { Button, Slider, TableCell, TableRow, Typography } from "@mui/material"

import DeleteIcon from "@mui/icons-material/Delete"
import SaveIcon from "@mui/icons-material/Save"
import exerciseService from "../services/exercise.service"

function ExerciseRowInfo(props) {
  const { exerciseId, traineeId, exerciseRoutineId, deleteExercise } = props
  const [exerciseInfo, setExerciseInfo] = useState(null)
  const [intensity, setIntensity] = useState(null)
  const [series, setSeries] = useState(null)
  const [reps, setReps] = useState(null)

  const getExerciseInfoOfRoutine = async (exerciseId, traineeId, exerciseRoutineId) => {
    try {
      const response = (
        // await exerciseService.getExercise(exerciseId, traineeId, exerciseRoutineId)
      ).data
      setExerciseInfo(response)
      setIntensity(response.intensity)
      setSeries(response.series)
      setReps(response.reps)
    } catch (error) {
      console.log(error)
    }
  }

  const udpateExerciseInfo = async () => {
    try {
      const response = (
        // await exerciseService.updateExerciseData(exerciseId, traineeId, {
          // serving_size_g: servingSize,
        // })
      ).data.updatedFood
      setExerciseInfo(response)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getExerciseInfoOfRoutine(exerciseId, traineeId, exerciseRoutineId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const verifyChange = (repsInfo, seriesInfo, intensityInfo) => {
    if (exerciseInfo.series === seriesInfo) return false
    else if (exerciseInfo.reps === repsInfo) return false
    else if (exerciseInfo.intensity === intensityInfo) return false
    else return true
  }

  return (
    exerciseInfo && (
      <TableRow key={exerciseId} size="small">
        <TableCell size="small">
          <Button
            variant="contained"
            disabled={verifyChange(reps, series, intensity)}
            color="primary"
            size="small"
            onClick={() => udpateExerciseInfo()}
          >
            <SaveIcon />
          </Button>
        </TableCell>
        <TableCell component="th" scope="row" size="small">
          {exerciseInfo.exerciseData.name}
        </TableCell>
        {/* Slider for series */}
        <TableCell size="small">
          <Slider
            value={series}
            min={1}
            step={1}
            max={30}
            // scale={(servingSize) => 10 * servingSize}
            onChange={(e) => setSeries(e.target.value)}
            valueLabelDisplay="auto"
            aria-labelledby="non-linear-slider"
          />
          <Typography id="serving-size-slider" gutterBottom margin={0}>
            <small>{`${series}`}</small>
          </Typography>
        </TableCell>

        {/* Slider for reps */}
        <TableCell size="small">
          <Slider
            value={reps}
            min={1}
            step={1}
            max={30}
            // scale={(servingSize) => 10 * servingSize}
            onChange={(e) => setReps(e.target.value)}
            valueLabelDisplay="auto"
            aria-labelledby="non-linear-slider"
          />
          <Typography id="reps-slider" gutterBottom margin={0}>
            <small>{`${reps}`}</small>
          </Typography>
        </TableCell>

        {/* Slider for intensity */}
        <TableCell size="small">
          <Slider
            value={intensity}
            min={1}
            step={1}
            max={100}
            // scale={(servingSize) => 10 * servingSize}
            onChange={(e) => setIntensity(e.target.value)}
            valueLabelDisplay="auto"
            aria-labelledby="non-linear-slider"
          />
          <Typography id="serving-size-slider" gutterBottom margin={0}>
            <small>{`${intensity}`}</small>
          </Typography>
        </TableCell>
        
        {/* For exercise Delete */}
        <TableCell size="small">
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => deleteExercise(exerciseId)}
          >
            <DeleteIcon />
          </Button>
        </TableCell>
      </TableRow>
    )
  )
}

export default ExerciseRowInfo
