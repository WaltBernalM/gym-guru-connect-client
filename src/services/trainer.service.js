import service from "./index"


const trainerService = {
  getAllTrainers: () => service.get('/api/trainers'),
  getTrainerInfo: (trainerId) => service.get(`/api/trainers/${trainerId}`),
  assignTraineeToTrainer: (trainerId, traineeId) => {
    return service.put(`/api/trainers/${trainerId}/trainee/${traineeId}`)
  },
}

export default trainerService
