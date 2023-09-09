import { useEffect, useState } from "react"
import { Button, Slider, TableCell, TableRow, Typography } from "@mui/material"

import DeleteIcon from "@mui/icons-material/Delete"
import SaveIcon from "@mui/icons-material/Save"
import foodService from "../services/foods.service"
import ErrorAnimation from "./ErrorAnimation"

function FoodRowInfo(props) {
  const {foodId, traineeId, portionId, deleteFood, handleAlert} = props
  const [foodInfo, setFoodInfo] = useState(null)
  const [servingSize, setServingSize] = useState(null)
  const [error, setError] = useState(false)

  const getFoodInfoOfPortion = async (foodId, traineeId, portionId) => {
    try {
      setError(false)
      const response = (await foodService.getFoodInTraineePortion(
        foodId,
        traineeId,
        portionId
      )).data
      setFoodInfo(response)
      setServingSize(response.serving_size_g)
    } catch (error) {
      setError(true)
    }
  }

  const updateFoodInfo = async () => {
    try {
      setError(false)
      const response = (
        await foodService.updateFoodData(foodId, traineeId, {
          serving_size_g: servingSize,
        })
      ).data.updatedFood
      setFoodInfo(response)
      handleAlert('Food updated', 'success')
    } catch (error) {
      handleAlert('Something went wrong', 'error')
    }
  }

  useEffect(() => {
    getFoodInfoOfPortion(foodId, traineeId, portionId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {!error && foodInfo && (
        <TableRow key={foodId} size="small">
          <TableCell size="small">
            <Button
              variant="contained"
              disabled={foodInfo.serving_size_g === servingSize ? true : false}
              color="primary"
              size="small"
              onClick={() => updateFoodInfo()}
            >
              <SaveIcon />
            </Button>
          </TableCell>
          <TableCell component="th" scope="row" size="small">
            {foodInfo.name}
          </TableCell>
          <TableCell size="small">
            <Slider
              value={servingSize / 10}
              min={1}
              step={1}
              max={30}
              scale={(servingSize) => 10 * servingSize}
              onChange={(e) => setServingSize(e.target.value * 10)}
              valueLabelDisplay="auto"
              aria-labelledby="non-linear-slider"
            />
            <Typography id="serving-size-slider" gutterBottom margin={0}>
              <small>{`${servingSize}g`}</small>
            </Typography>
          </TableCell>
          <TableCell size="small">
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => deleteFood(foodId)}
            >
              <DeleteIcon />
            </Button>
          </TableCell>
        </TableRow>
      )}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: 30,
            justifyContent: "center",
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          <ErrorAnimation />
        </div>
      )}
    </>
  )
}

export default FoodRowInfo