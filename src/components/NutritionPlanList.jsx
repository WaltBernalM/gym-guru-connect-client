import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { Fragment, useState } from "react"

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import Paper from "@mui/material/Paper"

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
            Portion #{row.name}
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
                      <TableCell>Portion size</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.foodList.map((food) => (
                      <TableRow key={food._id}>
                        <TableCell component="th" scope="row">
                          {food.name}
                        </TableCell>
                        <TableCell>
                          {food.servingSize}g
                        </TableCell>
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

function NutritionPlanList(props) {
  const { nutritionPlan } = props

  const rows = nutritionPlan.map(portion => {
    return {
      name: portion.portionNumber,
      foodList: portion.foodList.map(food => {
        return {
          _id: food._id,
          name: food.name,
          servingSize: food.serving_size_g
        }
      })
    }
  })

  return (
    <TableContainer component={Paper} sx={{maxWidth: 400}}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <Typography variant="h6">Nutrition Plan</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default NutritionPlanList