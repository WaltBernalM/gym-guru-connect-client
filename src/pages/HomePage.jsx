import { Button } from "@mui/material"
import traineeService from "../services/trainee.service"

const handleOnClick = async () => {
  const respose = await traineeService.getTrainee()
  console.log(respose)
}

function HomePage() {
  return (
    <div>
      HomePage
      <Button onClick={handleOnClick}>Get Trainees</Button>
    </div>
  )
}

export default HomePage