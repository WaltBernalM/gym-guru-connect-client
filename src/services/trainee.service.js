import service from './index'

const traineeService = {
  getTrainee: (traineeId) => service.get(`/api/trainees/${traineeId}`),
}

export default traineeService