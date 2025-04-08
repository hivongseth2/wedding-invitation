"use client"

import { useRef, useEffect, useState } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { useGLTF, Environment, PerspectiveCamera, useAnimations } from "@react-three/drei"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// Ring model component
function RingModel({ scrollYProgress, ...props }) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF("/wedding_ring.glb")
  const { actions } = useAnimations(animations, group)

  // Reference for animation
  const ringRef = useRef()
  const { camera } = useThree()

  // Set up the ring's initial position
  useEffect(() => {
    if (ringRef.current) {
      ringRef.current.position.set(0, 0, 0)
      ringRef.current.rotation.set(0, 0, 0)

      // Adjust camera position for better view
      camera.position.set(0, 2, 5)
      camera.lookAt(0, 0, 0)
    }
  }, [camera])

  // Set up scroll animation
  useEffect(() => {
    if (!ringRef.current) return

    // Timeline for ring rolling animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#ring-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          // Update the scrollYProgress state
          scrollYProgress(self.progress)
        },
      },
    })

    // Animation: Ring rolling along the X axis
    tl.to(
      ringRef.current.rotation,
      {
        x: Math.PI * 6, // Multiple full rotations
        ease: "power1.inOut",
      },
      0,
    )

    // Animation: Ring moving along the Z axis (forward)
    tl.to(
      ringRef.current.position,
      {
        z: -10, // Move forward
        ease: "power1.inOut",
      },
      0,
    )

    // Animation: Ring moving to the finger position at the end
    tl.to(
      ringRef.current.position,
      {
        x: 0,
        y: 1.5, // Move up to the finger height
        z: -15, // Final position
        ease: "power2.inOut",
      },
      0.7,
    )

    // Animation: Ring rotation slowing down and aligning with finger
    tl.to(
      ringRef.current.rotation,
      {
        x: Math.PI * 6.5, // Final rotation
        y: Math.PI / 2, // Rotate to align with finger
        ease: "power2.inOut",
      },
      0.7,
    )

    // Animation: Ring scaling slightly at the end
    tl.to(
      ringRef.current.scale,
      {
        x: 0.9,
        y: 0.9,
        z: 0.9,
        ease: "power2.inOut",
      },
      0.8,
    )

    return () => {
      // Clean up
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill()
      }
    }
  }, [scrollYProgress])

  // If we have a real model from the GLTF file
  if (nodes && Object.keys(nodes).length > 0) {
    return (
      <group ref={group} {...props} dispose={null}>
        <group ref={ringRef} name="Scene">
          {/* This assumes the structure of the loaded model - adjust based on your actual model */}
          <mesh castShadow receiveShadow geometry={nodes.Ring?.geometry} material={materials.Gold} />
        </group>
      </group>
    )
  }

  // Fallback: Create a simple ring if no model is loaded
  return (
    <group ref={group} {...props}>
      <group ref={ringRef}>
        <mesh castShadow receiveShadow>
          <torusGeometry args={[1, 0.3, 16, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.2} envMapIntensity={1} />
        </mesh>
      </group>
    </group>
  )
}

// Finger model at the end
function FingerModel(props) {
  const fingerRef = useRef()

  useEffect(() => {
    if (fingerRef.current) {
      // Position the finger at the end of the path
      fingerRef.current.position.set(0, 1.5, -15)
      // Rotate the finger to receive the ring
      fingerRef.current.rotation.set(0, Math.PI / 2, 0)
    }
  }, [])

  return (
    <group ref={fingerRef} {...props}>
      {/* Simple finger model made of cylinders */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 2, 32]} />
        <meshStandardMaterial color="#FFC0CB" roughness={0.8} />
      </mesh>

      {/* Fingernail */}
      <mesh position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <sphereGeometry args={[0.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
    </group>
  )
}

// Floor/path for the ring to roll on
function Floor(props) {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} {...props}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#f8f8f8" roughness={0.8} />
    </mesh>
  )
}

// Progress indicator
function ProgressIndicator({ progress }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "rgba(255, 255, 255, 0.2)",
        padding: "10px",
        borderRadius: "5px",
        backdropFilter: "blur(5px)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        zIndex: 1000,
      }}
    >
      <div>Scroll Progress: {Math.round(progress * 100)}%</div>
      <div
        style={{
          width: "100%",
          height: "4px",
          background: "rgba(255, 255, 255, 0.3)",
          borderRadius: "2px",
          marginTop: "5px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${progress * 100}%`,
            background: "white",
            borderRadius: "2px",
          }}
        ></div>
      </div>
    </div>
  )
}

// Main component
export default function ScrollingRing() {
  const [progress, setProgress] = useState(0)
  const containerRef = useRef()

  useEffect(() => {
    // Preload the model
    useGLTF.preload("/glb/ring.glb")

    // Set up the container height for scrolling
    if (containerRef.current) {
      // Make the container tall enough for scrolling
      containerRef.current.style.height = "500vh"
    }

    return () => {
      // Clean up any ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <div style={styles.mainContainer}>
      {/* Scrollable container */}
      <div id="ring-container" ref={containerRef} style={styles.scrollContainer}>
        {/* Fixed canvas container */}
        <div style={styles.canvasContainer}>
          <Canvas shadows dpr={[1, 2]} style={styles.canvas}>
            {/* Camera */}
            <PerspectiveCamera makeDefault fov={50} position={[0, 2, 5]} />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              intensity={1}
              castShadow
              shadow-mapSize={[2048, 2048]}
            />
            <pointLight position={[-10, 0, -20]} intensity={0.5} />
            <pointLight position={[0, -10, 0]} intensity={0.2} />

            {/* Environment for reflections */}
            <Environment preset="sunset" />

            {/* Models */}
            <RingModel scrollYProgress={setProgress} />
            <FingerModel />
            <Floor />

            {/* Disable OrbitControls to lock manual rotation */}
            {/* <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} /> */}
          </Canvas>

          {/* Overlay text */}
          <div style={styles.overlayText}>
            <h1>Wedding Ring Journey</h1>
            <p>Scroll down to see the ring roll toward its destiny</p>
          </div>

          {/* Progress indicator */}
          <ProgressIndicator progress={progress} />
        </div>
      </div>

      {/* Final section */}
      <div style={styles.finalSection}>
        <h2>The Perfect Match</h2>
        <p>When two souls are meant to be together, they will always find their way.</p>
      </div>
    </div>
  )
}

// Component styles
const styles = {
  mainContainer: {
    position: "relative",
    width: "100%",
    background: "linear-gradient(to bottom, #1a1a2e, #16213e, #0f3460)",
    color: "white",
    fontFamily: "Arial, sans-serif",
  },
  scrollContainer: {
    position: "relative",
    width: "100%",
  },
  canvasContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    zIndex: 10,
  },
  canvas: {
    width: "100%",
    height: "100%",
  },
  overlayText: {
    position: "absolute",
    top: "50px",
    left: "0",
    width: "100%",
    textAlign: "center",
    pointerEvents: "none",
    zIndex: 20,
  },
  finalSection: {
    position: "relative",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "0 20px",
    zIndex: 30,
    marginTop: "500vh", // Match the height of the scroll container
  },
}
