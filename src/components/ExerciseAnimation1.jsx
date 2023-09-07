import Lottie from "lottie-web"
import animationData from "../animations/exerciseAnimation1.json"
import { useRef, useEffect } from "react"

function ExerciseAnimation1() {
  const animationContainer = useRef(null)
  let animation

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    animation = Lottie.loadAnimation({
      container: animationContainer.current,
      animationData,
      loop: true,
      autoplay: true,
    })

    return () => {
      animation.destroy()
    }
  }, [])

  return (
    <div
      ref={animationContainer}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  )
}

export default ExerciseAnimation1
