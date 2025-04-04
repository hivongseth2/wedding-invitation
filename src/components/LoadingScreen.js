"use client"

import { useEffect } from "react"
import { gsap } from "gsap"

export default function LoadingScreen() {
  useEffect(() => {
    // Prevent scrolling during loading
    document.body.style.overflow = "hidden"

    // Animation timeline
    const tl = gsap.timeline()

    // Animate the loading elements
    tl.fromTo(".loading-ring", { strokeDashoffset: 283 }, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" })
      .fromTo(".loading-text", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, "-=1")
      .fromTo(
        ".loading-hearts",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.2,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.4",
      )

    // Heartbeat animation
    gsap.to(".loading-hearts", {
      scale: 1.1,
      repeat: -1,
      yoyo: true,
      duration: 0.8,
      ease: "power1.inOut",
      stagger: 0.2,
    })

    return () => {
      document.body.style.overflow = "auto"
      gsap.killTweensOf(".loading-ring, .loading-text, .loading-hearts")
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-background to-background/90 backdrop-blur-sm">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="loading-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--gold))" />
              <stop offset="100%" stopColor="hsl(var(--gold-light))" />
            </linearGradient>
          </defs>
          <circle
            className="loading-ring"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#loading-gradient)"
            strokeWidth="2"
            strokeDasharray="283"
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="loading-text font-playfair text-2xl text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light">
            C & C
          </span>
        </div>
      </div>

      <div className="mt-8 flex items-center">
        <div className="loading-hearts text-gold opacity-0 scale-0 transform -rotate-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div className="loading-hearts text-gold opacity-0 scale-0 mx-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div className="loading-hearts text-gold opacity-0 scale-0 transform rotate-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

