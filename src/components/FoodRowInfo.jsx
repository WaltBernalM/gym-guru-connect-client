import { useEffect, useState } from "react"
import { Button, Slider, TableCell, TableRow, Typography } from "@mui/material"

import DeleteIcon from "@mui/icons-material/Delete"
import SaveIcon from "@mui/icons-material/Save"
import foodService from "../services/foods.service"

function FoodRowInfo(props) {
  const {foodId, traineeId, portionId, deleteFood} = props
  const [foodInfo, setFoodInfo] = useState(null)
  const [servingSize, setServingSize] = useState(null)

  const getFoodInfoOfPortion = async (foodId, traineeId, portionId) => {
    try {
      const response = (await foodService.getFoodInTraineePortion(
        foodId,
        traineeId,
        portionId
      )).data
      setFoodInfo(response)
      setServingSize(response.serving_size_g)
    } catch (error) {
      console.log(error)
    }
  }

  const updateFoodInfo = async () => {
    try {
      const response = (
        await foodService.updateFoodData(foodId, traineeId, {
          serving_size_g: servingSize,
        })
      ).data.updatedFood
      setFoodInfo(response)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getFoodInfoOfPortion(foodId, traineeId, portionId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    foodInfo && (
      <TableRow key={foodId} size="small">
        <TableCell size="small">
          <Button
            variant="contained"
            disabled={foodInfo.serving_size_g === servingSize ? true : false }
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
    )
  )
}

export default FoodRowInfo