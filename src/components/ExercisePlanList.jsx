import {
  Box,
  Button,
  Collapse,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
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
import SearchIcon from "@mui/icons-material/Search"
import PostAddIcon from "@mui/icons-material/PostAdd"
import BackspaceIcon from "@mui/icons-material/Backspace"

import ExerciseRowInfo from "./ExerciseRowInfo"
import exerciseService from "../services/exercise.service"
import exerciseRoutineService from '../services/exerciseRoutine.service'

const initSwitches = {
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
}

function ExercisePlanList(props) {
  const { exercisePlan: traineeExercisePlan, traineeId } = props
  const { user } = useContext(AuthContext)
  const [exerciseQuerySearch, setExerciseQuerySearch] = useState(null)
  const [exerciseQueryError, setExerciseQueryError] = useState(null)
  const [exerciseQueryResult, setExerciseQueryResult] = useState(null)
  const [routineIdForExercise, setRoutineIdForExercise] = useState('')
  const [exercisePlan, setExercisePlan] = useState(traineeExercisePlan)
  const [canAddRoutine, setCanAddRoutine] = useState(false)

  const [switches, setSwitches] = useState(initSwitches)

  useEffect(() => {
    setExercisePlan(traineeExercisePlan)
    if (exercisePlan.length < 6) {
      setCanAddRoutine(true)
    } else {
      setCanAddRoutine(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createRoutine = async () => {

  }

  const deleteRoutine = async () => {

  }

  const handleQuerySearchInput = (field, value) => {
    setExerciseQuerySearch((prevVal) => ({...prevVal, [field]: value}))
  }

  const searchExercise = async () => {

  }

  const handleExerciseAssignRoutine = (e) => {

  }

  const addExerciseToRoutine = async () => {
    
  }

  const deleteExercise = async (exerciseId) => {

  }

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 600 }}>
      {/* Routine content Editor */}
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <Typography variant="h6">Exercise Plan</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* {rows.map((row) => (
            <Row key={row._id} row={row} />
          ))} */}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ExercisePlanList
