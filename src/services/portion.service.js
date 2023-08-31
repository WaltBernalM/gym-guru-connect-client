import service from "./index"

const portionService = {
  createPortion: (portionNumber, traineeId) => {
    return service.post(`/api/portions/trainee/${traineeId}`, { portionNumber })
  },
  deletePortion: (portionId, traineeId) => {
    return service.delete(`/api/portions/${portionId}/trainee/${traineeId}`)
  }
}

export default portionService