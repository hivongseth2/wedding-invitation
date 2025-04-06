"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"

export default function LovePathAnimation() {
  const containerRef = useRef(null)
  const heartRef = useRef(null)
  const pathRef = useRef(null)
// Add at the top:
const CONFIG = {
  PATH_HEIGHT: 8000, // or any value based on how long you want the scroll
}

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

    // Helper function for path ease (same as original)
    function pathEase(path, config = {}) {
      let axis = config.axis || "y",
        precision = config.precision || 1,
        rawPath = MotionPathPlugin.cacheRawPathMeasurements(
          MotionPathPlugin.getRawPath(gsap.utils.toArray(path)[0]),
          Math.round(precision * 12),
        ),
        useX = axis === "x",
        start = rawPath[0][useX ? 0 : 1],
        end = rawPath[rawPath.length - 1][rawPath[rawPath.length - 1].length - (useX ? 2 : 1)],
        range = end - start,
        l = Math.round(precision * 200),
        inc = 1 / l,
        positions = [0],
        a = [0],
        minIndex = 0,
        smooth = [0],
        minChange = (1 / l) * 0.6,
        smoothRange = config.smooth === true ? 7 : Math.round(config.smooth) || 0,
        fullSmoothRange = smoothRange * 2,
        getClosest = (p) => {
          while (positions[minIndex] <= p && minIndex++ < l) {}
          a.push(
            a.length &&
              ((p - positions[minIndex - 1]) / (positions[minIndex] - positions[minIndex - 1])) * inc + minIndex * inc,
          )
          smoothRange &&
            a.length > smoothRange &&
            a[a.length - 1] - a[a.length - 2] < minChange &&
            smooth.push(a.length - smoothRange)
        },
        i = 1

      for (; i < l; i++) {
        positions[i] = (MotionPathPlugin.getPositionOnPath(rawPath, i / l)[axis] - start) / range
      }

      positions[l] = 1

      for (i = 0; i < l; i++) {
        getClosest(i / l)
      }

      a.push(1) // must end at 1.

      if (smoothRange) {
        // smooth at the necessary indexes where a small difference was sensed
        smooth.push(l - fullSmoothRange + 1)
        smooth.forEach((i) => {
          let start = a[i],
            j = Math.min(i + fullSmoothRange, l),
            inc = (a[j] - start) / (j - i),
            c = 1
          i++
          for (; i < j; i++) {
            a[i] = start + inc * c++
          }
        })
      }

      l = a.length - 1

      return (p) => {
        const i = p * l,
          s = a[i | 0]
        return i ? s + (a[Math.ceil(i)] - s) * (i % 1) : 0
      }
    }

    // Set initial properties
    gsap.set("#motionSVG", { scale: 0.85, autoAlpha: 1 })
    gsap.set("#heart", { transformOrigin: "50% 50%", scaleX: -1 })

    let getProp = gsap.getProperty("#motionSVG"),
      flippedX = false,
      flippedY = false

    // Create the animation
    gsap.to("#motionSVG", {
      scrollTrigger: {
        trigger: "#motionPath",
        start: "top center",
        end: "bottom center",
        scrub: 0.7,
        markers: false,
        onUpdate: (self) => {
          const rotation = getProp("rotation"),
            flipY = Math.abs(rotation) > 90,
            flipX = self.direction === 1

          if (flipY !== flippedY || flipX !== flippedX) {
            gsap.to("#heart", {
              scaleY: flipY ? -1 : 1,
              scaleX: flipX ? -1 : 1,
              duration: 0.25,
            })
            flippedY = flipY
            flippedX = flipX
          }
        },
      },
      duration: 10,
      ease: pathEase("#motionPath", { smooth: true }), // Magic!
      immediateRender: true,
      motionPath: {
        path: "#motionPath",
        align: "#motionPath",
        alignOrigin: [0.5, 0.5],
        autoRotate: 0,
      },
    })

    // Add heartbeat animation to the heart
    gsap.to("#heart", {
      scale: 1.2,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    })

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      gsap.killTweensOf("#motionSVG")
      gsap.killTweensOf("#heart")
    }
  }, [])

  return (
    <div ref={containerRef} style={styles.container}>
      <div style={styles.spacer}></div>

      <svg
  id="love-scroll"
  xmlns="http://www.w3.org/2000/svg"
  x="0px"
  y="0px"
  viewBox={`0 0 1088.4 ${CONFIG.PATH_HEIGHT}`}
  style={{ ...styles.svg, height: `${CONFIG.PATH_HEIGHT}px` }}
>
        {/* Path for the heart to follow */}
        <path
          id="motionPath"
          ref={pathRef}
          d="M37.5,31C32.5,41.2,52.3,122.6,358,237.2c222.1,69.8,610.9-11.5,861.3,82.5
             c236.4,88.8,340.3,257.8,323.7,416.2c-19.9,209.7-162.4,595.6-340.4,613.1c-106.6-36.6-174.3,34.9-127.1,196.4
             c-24.6,284.5-286.8,140-346.4,140c-182.9-15.9-269.3,213.5-155.7,344.2c118,135.7,31.2,223.3,392,144.9
             c158.4-34.4,182.2,81,177.4,136.5c-26.9,51.3-27.4,334.3-150.7,382.5c-112.9,44.1-263.8-30.3-397.7-64.7
             c-141.7-36.4-257.9,86.3-257.9,86.3"
          style={styles.path}
        />

        {/* Heart that follows the path */}
        <g id="motionSVG">
          <g id="heart" ref={heartRef}>
          <svg width="80" height="80" viewBox="0 0 100 100">
  <defs>
    <filter id="glass" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0 
                    0 1 0 0 0 
                    0 0 1 0 0 
                    0 0 0 20 -10"
            result="glass"
          />
          <feComposite in="SourceGraphic" in2="glass" operator="atop" />
        </filter>
        <radialGradient id="spotlight" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FF3366" stopOpacity="0.5" />
        </radialGradient>
      </defs>

      <path
        d="M50,30 C35,10 10,20 10,40 C10,60 25,65 50,90 C75,65 90,60 90,40 C90,20 65,10 50,30 Z"
        fill="url(#spotlight)"
        filter="url(#glass)"
      />
    </svg>

          </g>
        </g>
      </svg>

      <div style={styles.spacer}></div>

      <div style={styles.message}>
        <h2>Our Love Journey</h2>
        <p>Scroll to follow our path of love...</p>
      </div>
    </div>
  )
}

// Component-scoped styles
const styles = {
  container: {
    position: "absolute",
    width: "100%",
    zIndex:10,
    backgroundColor:"transparent",
    overflowX: "hidden",
    fontFamily: "'Arial', sans-serif",
  },
  spacer: {
    height: "30vh",
  },
  svg: {
    width: "100%",
    height: "auto",
    display: "block",
  },
  path: {
    fill: "none",
    stroke: "#ffccdd",
    strokeMiterlimit: 10,
    strokeWidth: 5,
    strokeDasharray: 5,
  },
  heartPath: {
    filter: "drop-shadow(0 0 5px rgba(255, 51, 102, 0.5))",
  },
  message: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    textAlign: "center",
    color: "#FF3366",
    background: "rgba(255, 255, 255, 0.8)",
    padding: "15px 30px",
    borderRadius: "30px",
    boxShadow: "0 4px 15px rgba(255, 51, 102, 0.2)",
  },
}

