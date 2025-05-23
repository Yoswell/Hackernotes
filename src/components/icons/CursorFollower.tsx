import React, { useEffect, useRef } from "react"

const CursorFollower: React.FC = () => {
  const followerRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener("mousemove", handleMouseMove)

    let animationId: number

    const animate = () => {
      // Interpolación para efecto "slime"
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * 0.1
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * 0.1

      if (followerRef.current) {
        followerRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px)`
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

    return (
        <div
            className="cursor"
            ref={followerRef}
        />
    )
}

export default CursorFollower
