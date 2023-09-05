import service from "./index"

const exerciseService = {
  getAllExercises: () => service.get('/api/exercises')
}

export default exerciseService