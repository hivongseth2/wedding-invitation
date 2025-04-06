"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function ScrollAnimation() {
  const h1Ref = useRef(null)
  const containerRef = useRef(null)
  const combinedHeartRef = useRef(null)

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger)

    // Split text function
    const splitText = () => {
      const element = h1Ref.current
      if (!element) return

      const text = element.innerText
      const fragment = document.createDocumentFragment()

      for (let i = 0; i < text.length; i++) {
        const span = document.createElement("span")
        span.textContent = text[i] === " " ? "\u00A0" : text[i]
        fragment.appendChild(span)
      }

      element.innerHTML = ""
      element.appendChild(fragment)
    }

    // Call splitText function
    splitText()

    // Performance optimized animations
    const ctx = gsap.context(() => {
      // Initial setup - hide combined heart
      gsap.set(".combined-heart", {
        autoAlpha: 0,
        scale: 0.8,
      })

  

      // Scroll animations - hearts coming together
      const scrollAnim = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "13% center", // End halfway down
          scrub: 0.1,
          invalidateOnRefresh: true,
          // markers: true, // Uncomment for debugging
        },
      })

      // Hearts coming together animation
      scrollAnim
        .to(".heart-left", {
          xPercent: 100, // Move right to center
          ease: "power1.inOut",
        })
        .to(
          ".heart-right",
          {
            xPercent: -100, // Move left to center
            ease: "power1.inOut",
          },
          "<",
        ) // Same time as left heart
      
        .to([".heart-left", ".heart-right"], {
          autoAlpha: 0, // Fade out individual hearts
          duration: 0.1,
          ease: "power1.in",
        })
        .to(".combined-heart", {
          autoAlpha: 1, // Fade in combined heart
          scale: 1,
          ease: "back.out(1.7)",
        })

      // Heartbeat animation - triggered after hearts combine
      const heartbeatAnim = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "30% center", // Start where the previous animation ended
          end: "bottom bottom",
          scrub: false, // Not tied to scroll position
          toggleActions: "play none none reverse",
        },
      })

      // Heartbeat effect
      heartbeatAnim.to(".combined-heart", {
        scale: 1.2,
        duration: 0.15,
        ease: "power1.in",
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.6,
      })
    }, containerRef)

    // Cleanup function
    return () => {
      ctx.revert() // More efficient cleanup
    }
  }, [])

  return (
    <div ref={containerRef} style={styles.container}>
      <h1 ref={h1Ref} data-split style={styles.heading}>
        Scroll Down!
      </h1>

      {/* Left heart */}
      <div className="heart-left" style={{ ...styles.heartContainer, ...styles.heartLeft }}>
        <svg className="heart-svg" width="100" height="100" viewBox="0 0 100 100" style={styles.svg}>
          <path
            d="M50,30 C35,10 10,20 10,40 C10,60 25,65 50,90 C75,65 90,60 90,40 C90,20 65,10 50,30 Z"
            fill="#D83D3D"
            style={styles.heartPath}
          />
        </svg>
      </div>

      {/* Right heart */}
      <div className="heart-right" style={{ ...styles.heartContainer, ...styles.heartRight }}>
        <svg className="heart-svg" width="100" height="100" viewBox="0 0 100 100" style={styles.svg}>
          <path
            d="M50,30 C35,10 10,20 10,40 C10,60 25,65 50,90 C75,65 90,60 90,40 C90,20 65,10 50,30 Z"
            fill="#EFD050"
            style={styles.heartPath}
          />
        </svg>
      </div>

      {/* Combined heart (initially hidden) */}
      <div ref={combinedHeartRef} className="combined-heart" style={styles.combinedHeart}>
        <svg className="heart-svg" width="150" height="150" viewBox="0 0 100 100" style={styles.svg}>
          <path
            d="M50,30 C35,10 10,20 10,40 C10,60 25,65 50,90 C75,65 90,60 90,40 C90,20 65,10 50,30 Z"
            fill="#FF3366"
            style={styles.heartPath}
          />
        </svg>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Pangolin&display=swap');
        
        [data-split] > span {
          display: inline-block;
          will-change: transform;
        }
      `}</style>
    </div>
  )
}

// Optimized component-scoped styles
const styles = {
  container: {
    height: "500vh",
    fontFamily: "'Pangolin', cursive",
    letterSpacing: "0.05em",
    overflowX: "hidden",
    position: "relative",
  },

  heartContainer: {
    width: "100px",
    height: "100px",
    position: "fixed",
    top: "20%",
    marginTop: "-50px",
    willChange: "transform",
    filter: "drop-shadow(0 0 5px rgba(0,0,0,0.2))",
  },
  heartLeft: {
    left: "25%",
  },
  heartRight: {
    right: "25%",
  },
  combinedHeart: {
    width: "150px",
    height: "150px",
    position: "fixed",
    left: "48.5%",
    top: "30%",
    transform: "translate(-50%, -50%)",
    willChange: "transform",
    filter: "drop-shadow(0 0 10px rgba(0,0,0,0.3))",
    zIndex: 2100,
  },
  svg: {
    width: "100%",
    height: "100%",
  },
  heartPath: {
    willChange: "transform",
  },
}

