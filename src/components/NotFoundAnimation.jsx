import Lottie from "lottie-web"
import animationData from '../animations/notFoundAnimation.json'
import { useRef, useEffect } from "react"

function NotFoundAnimation() {
  const animationContainer = useRef(null)
  let animation

  useEffect (() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    animation = Lottie.loadAnimation({
      container: animationContainer.current,
      animationData,
      loop: true,
      autoplay: true
    })

    return () => {
      animation.destroy()
    }
  }, [])

  return (
    <div ref={animationContainer} style={{width: '40%'}}/>
  )
}

export default NotFoundAnimation