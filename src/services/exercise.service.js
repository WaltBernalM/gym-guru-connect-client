import service from "./index"

const exerciseService = {
  getAllExercises: () => service.get('/api/exercises'),
  getExercise: () => service.get(/),
  updateExerciseData: (exerciseId, traineeId, ) => service.put(/)
}

export default exerciseService