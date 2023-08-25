import service from "./index"

const appointmentService = {
  createAppointment: (trainerId, dayInfo, hour) => {
    return service.post(`/api/appointments/trainer/${trainerId}`, {
      dayInfo,
      hour,
    })
  },
  traineeBookAppointment: (appointmentId, trainerId, traineeId) => {
    return service.put(
      `/api/appointments/${appointmentId}/trainer/${trainerId}/trainee/${traineeId}`
    )
  },
  traineeRemoveAppointment: (appointmentId, trainerId, traineeId) => {
    return service.patch(
      `/api/appointments/${appointmentId}/trainer/${trainerId}/trainee/${traineeId}`
    )
  },
  getAppointmentsForTrainer: (trainerId) => {
    return service.get(`/api/appointments/trainer/${trainerId}`)
  },
  deletAppointmentForTrainer: (appointmentId, trainerId) => {
    return service.delete(
      `/api/appointments/${appointmentId}/trainer/${trainerId}`
    )
  },
}

export default appointmentService