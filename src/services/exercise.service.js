import service from "./index"

const exerciseService = {
  getAllExercises: () => service.get("/api/exercises"),
  postCustomExerciseToRoutine: (
    exerciseId,
    traineeId,
    exerciseRoutineId,
    series,
    reps,
    intensity
  ) => {
    return service.post(`/api/exercises/${exerciseId}/trainee/${traineeId}`, {
      exerciseRoutineId,
      series,
      reps,
      intensity,
    })
  },
  getExerciseInfo: (exerciseId, traineeId) =>{
    return service.get(`/api/exercises/${exerciseId}/trainee/${traineeId}`)
  },
  updateExerciseData: (exerciseId, traineeId, series, reps, intensity) =>
    service.put(`/api/exercises/${exerciseId}/trainee/${traineeId}`, {
      series,
      reps,
      intensity,
    }),
  deleteExercise: (exerciseId, traineeId) =>
    service.delete(`/api/exercises/${exerciseId}/trainee/${traineeId}`),
}

export default exerciseService