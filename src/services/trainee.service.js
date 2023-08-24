import service from './index'

const traineeService = {
  getTrainee: () => service.get("/api/trainees/64e5949dff7dc450f391ab6b"),
}

export default traineeService