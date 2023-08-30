import { Box, Button, Collapse, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemText, ListSubheader, MenuItem, OutlinedInput, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import { Fragment, useContext, useEffect, useState } from "react"

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import Paper from "@mui/material/Paper"
import { AuthContext } from "../context/auth.context"

import DeleteIcon from "@mui/icons-material/Delete"
import PlusOneIcon from "@mui/icons-material/PlusOne"
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd"
import SearchIcon from "@mui/icons-material/Search"
import PostAddIcon from "@mui/icons-material/PostAdd"

import FoodRowInfo from "./FoodRowInfo"
import foodService from "../services/foods.service"

const initFoodQuery = {
  name: "tuna",
  serving_size_g: 200,
}

function NutritionPlanList(props) {
  const { nutritionPlan: traineeNutritionPlan, traineeId } = props
  const { user } = useContext(AuthContext)
  const [open, setOpen] = useState(false)
  const [foodQuerySearch, setFoodQuerySearch] = useState(initFoodQuery)
  const [foodQueryError, setFoodQueryError] = useState(null)
  const [foodQueryResult, setFoodQueryResult] = useState(null)
  const [portionIdForFood, setPortionIdForFood] = useState("")

  const [nutritionPlan, setNutritionPlan] = useState(traineeNutritionPlan)

  useEffect(() => {
    setNutritionPlan(traineeNutritionPlan)
  }, [])

  const handleCreatePortion = async () => {
    try {
      
    } catch (error) {
      
    }
  }

  const handleQuerySearchInput = (field, value) => {
    setFoodQuerySearch((prevVal) => ({...prevVal, [field]:value}))
  }

  const searchFood = async () => {
    try {
      if (!foodQuerySearch.name || !foodQuerySearch.serving_size_g) {
        setFoodQueryError('Missing filed')
        return
      }
      const response = (await foodService.queryFood(foodQuerySearch)).data.foods[0]
      setFoodQueryResult(response)
    } catch (error) {
      setFoodQueryError(error)
    }
  }

  const handleFoodAssignPortion = (e) => {
    setPortionIdForFood(e.target.value)
  }

  const addFoodToPoriton = async () => {
    try {
      const form = {
        portionId: portionIdForFood,
        ...foodQueryResult
      }
      const response = (await foodService.createFoodForTraineePortion(traineeId, form)).data.updatedNutritionPlan
      setNutritionPlan(response)
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <TableContainer component={Paper} sx={{ maxWidth: 600 }}>
      <Table aria-label="collapsible table">
        {/* Portion content Editor */}
        <TableHead>
          <TableRow>
            {user && !user.isTrainer && <TableCell />}
            {user && user.isTrainer && (
              <TableCell>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => console.log("plus portion")}
                >
                  <PlusOneIcon sx={{ mr: 1 }} /> <small>{`Portion`}</small>
                </Button>
              </TableCell>
            )}
            <TableCell>
              <Typography variant="h6">Nutrition Plan</Typography>
            </TableCell>
            {user && user.isTrainer && <TableCell />}
          </TableRow>

          {user && user.isTrainer && (
            <TableRow>
              <TableCell sx={{ paddingRight: 0 }}>
                <FormControl
                  sx={{
                    m: 1,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  variant="outlined"
                  size="small"
                >
                  <div style={{ maxWidth: 120 }}>
                    <TextField
                      id="outlined-basic"
                      label="food"
                      variant="outlined"
                      size="small"
                      sx={{ maxWidth: "100%" }}
                      fullWidth
                      value={foodQuerySearch.name}
                      onChange={(e) =>
                        handleQuerySearchInput("name", e.target.value)
                      }
                    />
                    <TextField
                      label="grams"
                      inputProps={{
                        step: 10,
                        min: 10,
                        max: 300,
                        type: "number",
                      }}
                      fullWidth
                      size="small"
                      sx={{ minWidth: 110, maxWidth: "100%", marginTop: 1 }}
                      value={foodQuerySearch.serving_size_g}
                      onChange={(e) =>
                        handleQuerySearchInput("serving_size_g", e.target.value)
                      }
                    />
                  </div>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    sx={{ marginLeft: 1 }}
                    onClick={() => searchFood()}
                  >
                    <SearchIcon />
                  </IconButton>
                </FormControl>
              </TableCell>
              <TableCell>
                <List
                  sx={{
                    width: "100%",
                    overflow: "auto",
                    height: 140,
                    border: "1px solid",
                    borderColor: "rgb(0,0,0,0.4)",
                    borderRadius: "10px",
                  }}
                  subheader={<li />}
                >
                  <li>
                    <ul>
                      <ListSubheader
                        sx={{
                          padding: 0,
                          margin: 0,
                          textAlign: "center",
                          height: 40,
                        }}
                      >
                        Search Result
                      </ListSubheader>
                      {foodQueryResult && (
                        <>
                          <ListItem sx={{ paddingY: 0, paddingX: 1 }}>
                            <ListItemText
                              primary={`Name: ${foodQueryResult.name}`}
                            />
                          </ListItem>
                          <ListItem sx={{ paddingY: 0, paddingX: 1 }}>
                            <ListItemText
                              primary={`Serv. Size: ${foodQueryResult.serving_size_g}g`}
                            />
                          </ListItem>
                          <ListItem sx={{ paddingY: 0, paddingX: 1 }}>
                            <ListItemText
                              primary={`Protein: ${foodQueryResult.protein_g}g`}
                            />
                          </ListItem>
                          <ListItem sx={{ paddingY: 0, paddingX: 1 }}>
                            <ListItemText
                              primary={`Calories: ${foodQueryResult.calories}`}
                            />
                          </ListItem>
                          <ListItem sx={{ paddingY: 0, paddingX: 1 }}>
                            <ListItemText
                              primary={`Carbs: ${foodQueryResult.carbohydrates_total_g}g`}
                            />
                          </ListItem>
                          <ListItem sx={{ paddingY: 0, paddingX: 1 }}>
                            <ListItemText
                              primary={`Total Fat: ${foodQueryResult.fat_total_g}g`}
                            />
                          </ListItem>
                          <ListItem sx={{ paddingY: 0, paddingX: 1 }}>
                            <ListItemText
                              primary={`Sat. Fat: ${foodQueryResult.fat_saturated_g}g`}
                            />
                          </ListItem>
                        </>
                      )}
                    </ul>
                  </li>
                </List>
              </TableCell>
              <TableCell align="center" sx={{ maxWidth: 150 }}>
                <Button
                  variant="outlined"
                  startIcon={<PostAddIcon />}
                  sx={{ marginY: 1 }}
                  disabled={portionIdForFood ? false : true}
                  onClick={() => addFoodToPoriton()}
                >
                  Add To:
                </Button>
                <FormControl sx={{ minWidth: 110, marginY: 1 }} size="small">
                  <InputLabel>Portion #</InputLabel>
                  <Select
                    value={portionIdForFood}
                    label="portionAssign"
                    onChange={handleFoodAssignPortion}
                    disabled={foodQueryResult ? false : true}
                  >
                    <MenuItem value="" key="None">
                      <em>None</em>
                    </MenuItem>
                    {nutritionPlan.map((portion) => {
                      return (
                        <MenuItem value={portion._id} key={portion._id}>
                          Portion #{portion.portionNumber}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          )}
        </TableHead>

        {/* Portion and Food Editor */}
        <TableBody>
          {nutritionPlan.map((portion) => {
            const { _id: portionId, foodList } = portion
            return (
              <Fragment key={portionId}>
                <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => setOpen(!open)}
                    >
                      {open ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    Portion #{portion.portionNumber}
                  </TableCell>
                  {user && user.isTrainer && (
                    <TableCell component="th" scope="row">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => {}}
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>

                <TableRow key={portion._id}>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <Table size="small" aria-label="foods">
                          <TableHead>
                            <TableRow>
                              {user && user.isTrainer && (
                                <TableCell>
                                  <Button
                                    onClick={() =>
                                      console.log("add food to ", portionId)
                                    }
                                  >
                                    <PlaylistAddIcon />
                                  </Button>
                                </TableCell>
                              )}
                              <TableCell>Name</TableCell>
                              <TableCell>Portion size</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {user &&
                              !user.isTrainer &&
                              foodList.map((food) => {
                                return (
                                  <TableRow key={food._id}>
                                    <TableCell component="th" scope="row">
                                      {food.name}
                                    </TableCell>
                                    <TableCell>
                                      {`${food.serving_size_g} g`}
                                    </TableCell>
                                    <TableCell />
                                  </TableRow>
                                )
                              })}
                            {user &&
                              user.isTrainer &&
                              foodList.map((food) => {
                                return (
                                  <FoodRowInfo
                                    key={food._id}
                                    foodId={food._id}
                                    traineeId={traineeId}
                                    portionId={portionId}
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
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default NutritionPlanList