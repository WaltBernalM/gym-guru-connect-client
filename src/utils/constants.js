export const API_URL = "http://localhost:5005/"


export const options = {
  timeZone: "America/Los_Angeles",
  year: "numeric",
  month: "numeric",
  day: "numeric",
}
const currentDate = new Date().toLocaleString("en-US", options)
export const today = new Date(currentDate)