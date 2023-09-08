import { useEffect, useState } from "react"
import { Button, Slider, TableCell, TableRow, Typography } from "@mui/material"

import DeleteIcon from "@mui/icons-material/Delete"
import SaveIcon from "@mui/icons-material/Save"
import exerciseService from "../services/exercise.service"
import ErrorAnimation from "./ErrorAnimation"

function ExerciseRowInfo(props) {
  const { exerciseId, traineeId, deleteExercise } = props
  const [exerciseInfo, setExerciseInfo] = useState(null)
  const [intensity, setIntensity] = useState(null)
  const [series, setSeries] = useState(null)
  const [reps, setReps] = useState(null)
  const [error, setError] = useState(false)

  const getExerciseInfoOfRoutine = async (exerciseId, traineeId) => {
    try {
      setError(false)
      const response = (
        await exerciseService.getExerciseInfo(exerciseId, traineeId)
      ).data.exercise
      setExerciseInfo(response)
      setIntensity(response.intensity)
      setSeries(response.series)
      setReps(response.reps)
    } catch (error) {
      setError(true)
    }
  }

  const udpateExerciseInfo = async () => {
    try {
      setError(false)
      const response = (
        await exerciseService.updateExerciseData(
          exerciseId,
          traineeId,
          series,
          reps,
          intensity
        )
      ).data.updatedExercise
      setExerciseInfo(response)
    } catch (error) {
      setError(true)
    }
  }

  useEffect(() => {
    getExerciseInfoOfRoutine(exerciseId, traineeId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const verifyChange = (repsInfo, seriesInfo, intensityInfo) => {
    if (
      exerciseInfo.series === seriesInfo &&
      exerciseInfo.reps === repsInfo &&
      exerciseInfo.intensity === intensityInfo
    )
      return true
    else return false
  }

  return (
    <>
      {!error && exerciseInfo && (
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
              max={20}
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
              value={intensity * 100}
              min={10}
              step={5}
              max={95}
              scale={(intensity) => intensity / 100}
              onChange={(e) => setIntensity(e.target.value / 100)}
              valueLabelDisplay="auto"
              aria-labelledby="non-linear-slider"
              sx={{ minWidth: 50 }}
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
      )}
      {error && (
        <div style={{display: "flex", alignItems: "center", width: 30, justifyContent: 'center', marginLeft: 10, marginTop: 10 }}>
          <ErrorAnimation/>
        </div>
      )}
    </>
  )
}

export default ExerciseRowInfo
