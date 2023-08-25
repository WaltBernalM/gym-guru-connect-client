import service from "./index"


const trainerService = {
  getAllTrainers: () => service.get('/api/trainers'),
  getTrainerInfo: (trainerId) => service.get(`/api/trainers/${trainerId}`),
}

export default trainerService
