import { Box, Button, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import Paper from "@mui/material/Paper"
import { Fragment, useState } from "react"

const Row = (props) => {
  const { row } = props
  const [open, setOpen] = useState(false)

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          Day #{row.day}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="foods">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Series</TableCell>
                    <TableCell>Reps</TableCell>
                    <TableCell>Intensity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.exerciseList.map((exercise) => (
                    <TableRow key={exercise._id}>
                      <TableCell component="th" scope="row">
                        <Button
                          href={`/exercises/${exercise.exerciseData._id}`}
                        >
                          {exercise.exerciseData.name}
                        </Button>
                      </TableCell>
                      <TableCell>{exercise.series}</TableCell>
                      <TableCell>{exercise.reps}</TableCell>
                      <TableCell>{100 * exercise.intensity}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}

function ExercisePlanList(props) {
  const { exercisePlan: rows } = props

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 400 }}>
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
          {rows.map((row) => (
            <Row key={row._id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ExercisePlanList