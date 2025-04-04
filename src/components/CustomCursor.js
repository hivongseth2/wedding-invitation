"use client"

import { useEffect, useState } from "react"
import { gsap } from "gsap"

export default function CustomCursor({ cursorType = "default" }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })

      if (!isVisible) {
        setIsVisible(true)
      }
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    window.addEventListener("mousemove", updatePosition)
    document.body.addEventListener("mouseleave", handleMouseLeave)
    document.body.addEventListener("mouseenter", handleMouseEnter)

    // Hide default cursor
    document.body.style.cursor = "none"

    return () => {
      window.removeEventListener("mousemove", updatePosition)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
      document.body.removeEventListener("mouseenter", handleMouseEnter)

      // Restore default cursor
      document.body.style.cursor = "auto"
    }
  }, [isVisible])

  useEffect(() => {
    // Animate cursor based on type
    gsap.to(".cursor-dot", {
      scale: cursorType === "default" ? 1 : cursorType === "hover" ? 1.5 : 2,
      opacity: cursorType === "default" ? 0.7 : 1,
      backgroundColor:
        cursorType === "default"
          ? "rgba(212, 175, 55, 0.7)"
          : cursorType === "hover"
            ? "rgba(212, 175, 55, 0.9)"
            : "rgba(212, 175, 55, 1)",
      duration: 0.3,
    })

    gsap.to(".cursor-outline", {
      scale: cursorType === "default" ? 1 : cursorType === "hover" ? 1.5 : 2,
      opacity: cursorType === "default" ? 0.3 : 0.5,
      borderColor:
        cursorType === "default"
          ? "rgba(212, 175, 55, 0.3)"
          : cursorType === "hover"
            ? "rgba(212, 175, 55, 0.5)"
            : "rgba(212, 175, 55, 0.7)",
      duration: 0.3,
    })

    // Add text based on cursor type
    const cursorText = document.querySelector(".cursor-text")
    if (cursorText) {
      if (cursorType === "view") {
        cursorText.textContent = "View"
        gsap.to(cursorText, { opacity: 1, scale: 1, duration: 0.3 })
      } else if (cursorType === "click") {
        cursorText.textContent = "Click"
        gsap.to(cursorText, { opacity: 1, scale: 1, duration: 0.3 })
      } else {
        gsap.to(cursorText, { opacity: 0, scale: 0.5, duration: 0.3 })
      }
    }
  }, [cursorType])

  return (
    <div
      className={`fixed pointer-events-none z-[9999] transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="cursor-dot absolute w-3 h-3 bg-gold rounded-full -ml-1.5 -mt-1.5"></div>
      <div className="cursor-outline absolute w-8 h-8 border border-gold rounded-full -ml-4 -mt-4"></div>
      <div className="cursor-text absolute text-xs font-montserrat text-white bg-gold/80 px-2 py-1 rounded-full -ml-8 -mt-8 opacity-0 scale-50 whitespace-nowrap"></div>
    </div>
  )
}

