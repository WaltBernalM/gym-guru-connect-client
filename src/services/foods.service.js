import service from "./index"

const foodService = {
  queryFood: (foodQuerySearch) => {
    return service.get(
      `/api/foods?query=${foodQuerySearch.serving_size_g}g ${foodQuerySearch.name}`
    )
  },
  createFoodForTraineePortion: (traineeId, foodInfo) => {
    return service.post(`/api/foods/trainee/${traineeId}`, foodInfo)
  },
  getFoodInTraineePortion: (foodId, traineeId, portionId) => {
    return service.get(
      `/api/foods/${foodId}/trainee/${traineeId}/portion/${portionId}`
    )
  },
  updateFoodData: (foodId, traineeId, serving_size_g) => {
    return service.put(
      `/api/foods/${foodId}/trainee/${traineeId}`,
      serving_size_g
    )
  },
}

export default foodService