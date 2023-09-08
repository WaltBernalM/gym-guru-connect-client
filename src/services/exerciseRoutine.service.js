import service from "./index"

const exerciseRoutine = {
  addExerciseRoutine: (day, traineeId) =>
    service.post(
      `/api/exercise-routines/trainee/${traineeId}`, { day }
    ),
  deleteExercise: (exerciseRoutineId, traineeId) =>
    service.delete(
      `/api/exercise-routines/${exerciseRoutineId}/trainee/${traineeId}`
    ),
}

export default exerciseRoutine