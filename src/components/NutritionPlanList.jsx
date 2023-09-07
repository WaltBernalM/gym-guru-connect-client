import { Box, Button, Collapse, Divider, FormControl, IconButton, InputLabel, List, ListItem, ListItemText, ListSubheader, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import { Fragment, useContext, useEffect, useState } from "react"

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import Paper from "@mui/material/Paper"
import { AuthContext } from "../context/auth.context"

import PlusOneIcon from "@mui/icons-material/PlusOne"
import SearchIcon from "@mui/icons-material/Search"
import PostAddIcon from "@mui/icons-material/PostAdd"
import BackspaceIcon from "@mui/icons-material/Backspace"

import FoodRowInfo from "./FoodRowInfo"
import foodService from "../services/foods.service"
import portionService from "../services/portion.service"

const initFoodQuery = {
  name: "tuna",
  serving_size_g: 200,
}

const initSwitches = {
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false
}

function NutritionPlanList(props) {
  const { nutritionPlan: traineeNutritionPlan, traineeId } = props
  const { user } = useContext(AuthContext)
  const [foodQuerySearch, setFoodQuerySearch] = useState(initFoodQuery)
  const [foodQueryError, setFoodQueryError] = useState(null)
  const [foodQueryResult, setFoodQueryResult] = useState(null)
  const [portionIdForFood, setPortionIdForFood] = useState("")
  const [nutritionPlan, setNutritionPlan] = useState(traineeNutritionPlan)
  const [canAddPortion, setCanAddPortion] = useState(false)

  const [switches, setSwitches] = useState(initSwitches)

  useEffect(() => {
    setNutritionPlan(traineeNutritionPlan)
    if (nutritionPlan.length < 6) {
      setCanAddPortion(true)
    } else {
      setCanAddPortion(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createPortion = async () => {
    try {
      const possiblePortionNumber = [1, 2, 3, 4, 5, 6]
      const takenPortionNumbers = nutritionPlan.map(portion => portion.portionNumber)
      const availablePortionNumbers = possiblePortionNumber
        .filter(number => {
          return takenPortionNumbers.includes(number) ? false : true
        })
      
      if (availablePortionNumbers.length === 1) { 
        setCanAddPortion(false)
      }
      if (availablePortionNumbers.length === 0) return

      const response = (await portionService.createPortion(
        availablePortionNumbers[0],
        traineeId
      )).data.updatedNutritionPlan
      setNutritionPlan(response)
    } catch (error) {
      console.log(error)
    }
  }

  const deletePortion = async (portionId) => { 
    try {
      const response = (await portionService.deletePortion(portionId, traineeId)).data.updatedNutritionPlan
      setNutritionPlan(response)
      if (response.length < 6) {
        setCanAddPortion(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleQuerySearchInput = (field, value) => {
    setFoodQuerySearch((prevVal) => ({ ...prevVal, [field]: value }))
  }

  const searchFood = async () => {
    try {
      setFoodQueryError(null)
      if (!foodQuerySearch.name || !foodQuerySearch.serving_size_g) {
        setFoodQueryError("Missing filed")
        return
      }
      const response = (await foodService.queryFood(foodQuerySearch)).data
        .foods[0]
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
        ...foodQueryResult,
      }
      const response = (
        await foodService.createFoodForTraineePortion(traineeId, form)
      ).data.updatedNutritionPlan
      setNutritionPlan(response)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteFood = async (foodId) => {
    try {
      const response = (await foodService.deleteFood(foodId, traineeId)).data
        .updatedNutritionPlan
      setNutritionPlan(response)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 600 }}>
      <Table aria-label="collapsible table">
        {/* Portion content Editor */}
        <TableHead size="small">
          <TableRow size="small">
            {user && !user.isTrainer && <TableCell />}
            {user && user.isTrainer && (
              <TableCell size="small">
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => createPortion()}
                  disabled={canAddPortion ? false : true}
                >
                  <PlusOneIcon sx={{ mr: 1 }} /> <small>{`Portion`}</small>
                </Button>
              </TableCell>
            )}
            <TableCell size="small">
              <Typography variant="h6">Nutrition Plan</Typography>
            </TableCell>
            {user && user.isTrainer && <TableCell />}
          </TableRow>

          {user && user.isTrainer && (
            <TableRow size="small">
              <TableCell sx={{ paddingX: 0 }} size="small">
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
                  <div style={{ minWidth: 80, maxWidth: 140 }}>
                    <TextField
                      id="outlined-basic"
                      label={foodQuerySearch.name ? "name" : "empty"}
                      variant="outlined"
                      size="small"
                      sx={{ maxWidth: "100%" }}
                      fullWidth
                      error={foodQuerySearch.name ? false : true}
                      value={foodQuerySearch.name}
                      onChange={(e) =>
                        handleQuerySearchInput("name", e.target.value)
                      }
                    />
                    <TextField
                      label={foodQuerySearch.serving_size_g ? "grams" : "empty"}
                      inputProps={{
                        step: 10,
                        min: 10,
                        max: 300,
                        type: "number",
                      }}
                      fullWidth
                      error={foodQuerySearch.serving_size_g ? false : true}
                      size="small"
                      sx={{ maxWidth: "100%", marginTop: 1 }}
                      value={foodQuerySearch.serving_size_g}
                      onChange={(e) =>
                        handleQuerySearchInput("serving_size_g", e.target.value)
                      }
                    />
                  </div>
                  <IconButton
                    size="small"
                    sx={{ marginLeft: 1 }}
                    onClick={() => searchFood()}
                  >
                    <SearchIcon />
                  </IconButton>
                </FormControl>
              </TableCell>
              <TableCell size="small" sx={{ paddingX: 0 }}>
                <List
                  size="small"
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
                    <ul style={{ padding: 0 }}>
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
                        {foodQueryResult ? foodQueryResult.name : "Result"}
                      </ListSubheader>
                      {foodQueryError && (
                        <ListItem sx={{ paddingY: 0, paddingX: 1 }}>
                          <ListItemText
                            sx={{ color: "red" }}
                            primary={`${
                              foodQueryError === "AxiosError: Network Error"
                              ? "Food details server not available, please try later."
                              : foodQueryError
                            }`}
                          />
                        </ListItem>
                      )}
                      {!foodQueryError && foodQueryResult && (
                        <>
                          <ListItem sx={{ paddingY: 0, paddingX: 1 }}>
                            <ListItemText>
                              <Typography
                                variant="body1"
                                style={{ fontSize: "14px" }}
                              >
                                {`Serv. Size: ${foodQueryResult.serving_size_g}g`}
                              </Typography>
                            </ListItemText>
                          </ListItem>
                          <Divider />
                          <ListItem sx={{ paddingY: 0, paddingX: 1 }}>
                            <ListItemText>
                              <Typography
                                variant="body1"
                                style={{ fontSize: "14px" }}
                              >
                                {`Protein: ${foodQueryResult.protein_g}g`}
                              </Typography>
                            </ListItemText>
                          </ListItem>
                          <Divider />
                          <ListItem sx={{ paddingY: 0, paddingX: 1 }}>
                            <ListItemText>
                              <Typography
                                variant="body1"
                                style={{ fontSize: "14px" }}
                              >
                                {`Calories: ${foodQueryResult.calories}`}
                              </Typography>
                            </ListItemText>
                          </ListItem>
                          <Divider />
                          <ListItem sx={{ paddingY: 0, paddingX: 1 }}>
                            <ListItemText>
                              <Typography
                                variant="body1"
                                style={{ fontSize: "14px" }}
                              >
                                {`Carbs: ${foodQueryResult.carbohydrates_total_g}g`}
                              </Typography>
                            </ListItemText>
                          </ListItem>
                          <Divider />
                          <ListItem sx={{ paddingY: 0, paddingX: 1 }}>
                            <ListItemText>
                              <Typography
                                variant="body1"
                                style={{ fontSize: "14px" }}
                              >
                                {`Total Fat: ${foodQueryResult.fat_total_g}g`}
                              </Typography>
                            </ListItemText>
                          </ListItem>
                          <Divider />
                          <ListItem sx={{ paddingY: 0, paddingX: 1 }}>
                            <ListItemText>
                              <Typography
                                variant="body1"
                                style={{ fontSize: "14px" }}
                              >
                                {`Sat. Fat: ${foodQueryResult.fat_saturated_g}g`}
                              </Typography>
                            </ListItemText>
                          </ListItem>
                        </>
                      )}
                    </ul>
                  </li>
                </List>
              </TableCell>
              <TableCell
                align="center"
                sx={{ maxWidth: 150, paddingX: 1 }}
                size="small"
              >
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PostAddIcon />}
                  sx={{ marginY: 1 }}
                  disabled={portionIdForFood ? false : true}
                  onClick={() => addFoodToPoriton()}
                >
                  Add To:
                </Button>
                <FormControl sx={{ minWidth: 100, marginY: 1 }} size="small">
                  <InputLabel size="small">
                    <small>Portion #</small>
                  </InputLabel>
                  <Select
                    value={portionIdForFood}
                    label="portionAssign"
                    onChange={handleFoodAssignPortion}
                    disabled={foodQueryResult ? false : true}
                    size="small"
                  >
                    <MenuItem value="" key="None" size="small">
                      <em>None</em>
                    </MenuItem>
                    {nutritionPlan.map((portion) => {
                      return (
                        portion && (
                          <MenuItem
                            value={portion._id}
                            key={portion._id}
                            size="small"
                          >
                            Portion #{portion.portionNumber}
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

        {/* Portion and Food Editor */}
        <TableBody size="small">
          {nutritionPlan.map((portion) => {
            const { _id: portionId, foodList, portionNumber } = portion
            return (
              portion && (
                <Fragment key={portionId}>
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
                            [portionNumber]: !prevVal[portionNumber],
                          }))
                        }
                      >
                        {switches[portionNumber] ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row" size="small">
                      Portion #{portion.portionNumber}
                    </TableCell>
                    {user && user.isTrainer && (
                      <TableCell component="th" scope="row" size="small">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<BackspaceIcon />}
                          onClick={() => deletePortion(portion._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                  <TableRow key={portion._id}>
                    <TableCell style={{ padding: 0 }} colSpan={6} size="small">
                      <Collapse
                        in={switches[portionNumber]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ marginY: 1 }}>
                          <Table size="small" aria-label="foods">
                            <TableHead>
                              <TableRow>
                                {user && user.isTrainer && (
                                  <TableCell size="small"></TableCell>
                                )}
                                <TableCell size="small">Food name</TableCell>
                                <TableCell size="small">Portion size</TableCell>
                                <TableCell size="small"></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {user &&
                                !user.isTrainer &&
                                foodList.map((food) => {
                                  return (
                                    <TableRow key={food._id} size="small">
                                      <TableCell
                                        component="th"
                                        scope="row"
                                        size="small"
                                      >
                                        {food.name}
                                      </TableCell>
                                      <TableCell size="small">
                                        {`${food.serving_size_g} g`}
                                      </TableCell>
                                      <TableCell size="small" />
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
                                      deleteFood={deleteFood}
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

export default NutritionPlanList