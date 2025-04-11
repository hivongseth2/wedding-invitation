"use client"

import { useRef, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, Environment, PerspectiveCamera, useAnimations } from "@react-three/drei"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import * as THREE from "three"

gsap.registerPlugin(ScrollTrigger)
useGLTF.preload("glb/ring.glb") // Preload model
function RingModel({ onScrollProgress }) {
  const group = useRef()
  const ringRef = useRef()
  const { nodes, materials, animations } = useGLTF("glb/ring.glb")
  const ring =  useGLTF("glb/ring.glb")
  console.log(ring);
  
  const { actions } = useAnimations(animations, group)
  useEffect(() => {
    const ring = ringRef.current
    gsap.set(ring.rotation, { x:-0.3, y: 0, z: 0 })

    gsap.set(ring.position, { x: 0, y: 0, z: -35 })
    gsap.set(ring.scale, { x: 0.5, y: 0.5, z: 0.5 })
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#ring-container",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => onScrollProgress(self.progress),
      },
    });
  
    tl.to(ring.position, { z: -10, y: 2, x:3,duration: 1.5, ease: "sine.out" }, 0)
    .to(ring.scale, { x: 1, y: 1, z: 1 ,ease: "sine.in"},0)

      .to(ring.rotation, { x: Math.PI * 0.3, y: Math.PI * 0.4, duration: 1.5, ease: "sine.out" }, 0)

      // Lượn sang phải
      .to(ring.position, { x: "+="+5, duration: 1.2, ease: "sine.inOut" }, ">")
      .to(ring.rotation, { y: "+=" + Math.PI * 1, duration: 1.2, ease: "sine.inOut" }, "<")
  
      // Văng sang trái
      .to(ring.position, { x: -5, y:-1, duration: 1.2, ease: "sine.inOut" }, ">")
      .to(ring.rotation, { x: "+=" + Math.PI * 2, duration: 1.2, ease: "sine.inOut" }, "<")
  
      // Rơi thẳng xuống, xoay mạnh
      .to(ring.position, { y: -4,x:-5, duration: 2.5, ease: "power2.in" }, ">")
      .to(ring.rotation, {
        x:  1,
        y: 0,
        duration: 2.5,
        ease: "power2.in",
      }, "<")
  
      // Hạ cánh & thu nhỏ


      .to(ring.position, { y: 4.1, x: -5.26, z: -5.3, duration: 1.2, ease: "sine.out" }, ">")
      .to(ring.scale, { x: 0.17, y: 0.17, z: 0.17, duration: 1, ease: "sine.out" }, "<")
      .to(ring.rotation, { x: 7, y: 1.4,z:-5.2, duration: 1.5, ease: "sine.out" },  "<")
  
    return () => tl.scrollTrigger?.kill();
  }, [onScrollProgress]);
  return (
    <group ref={group} dispose={null}>
      <group ref={ringRef}>
        {nodes?.Thering?.children[0] ? (
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Thering.children[0].geometry}
            material={nodes.Thering.children[0].material}
          />
        ) : (
          <mesh castShadow receiveShadow>
            <torusGeometry args={[1, 0.3, 32, 64]} />
            <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.2} envMapIntensity={1.5} />
          </mesh>
        )}
      </group>
    </group>
  )
}

export default function ScrollingRing({
  showProgress = true,
  showText = true,
  height = "100%",
  zIndex = 10,
  absolute = true,
  className = "",
  showLightRays = true,
}) {
  const [progress, setProgress] = useState(0)
  const containerRef = useRef()

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.height = height
    }
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [height])

  const containerStyle = absolute ? { ...styles.absoluteContainer, zIndex } : styles.relativeContainer

  return (
    <div className={className} style={containerStyle}>
      <div id="ring-container" ref={containerRef} style={styles.scrollContainer}>
        <div style={styles.canvasContainer}>
        <Canvas shadows>
  <PerspectiveCamera makeDefault fov={45} position={[0, 2, 5]} />

  <ambientLight intensity={0.3} />
  <directionalLight
    castShadow
    intensity={1.2}
    position={[5, 10, 5]}
    shadow-mapSize-width={1024}
    shadow-mapSize-height={1024}
  />
  <spotLight
    intensity={2}
    angle={0.3}
    penumbra={1}
    position={[0, 5, 5]}
    castShadow
    color="#fff6e0"
  />

  <Environment preset="night" />
  <RingModel onScrollProgress={setProgress} />
</Canvas>

        </div>
      </div>
    </div>
  )
}

// Component styles
const styles = {
  absoluteContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
  relativeContainer: {
    position: "relative",
    width: "100%",
  },
  scrollContainer: {
    position: "relative",
    width: "100%",
    pointerEvents: "auto",
  },
  canvasContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
  },
  overlayText: {
    position: "absolute",
    top: "40px",
    left: 0,
    width: "100%",
    textAlign: "center",
    color: "white",
    pointerEvents: "none",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "300",
    margin: "0 0 10px 0",
    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
  },
  subtitle: {
    fontSize: "1.2rem",
    fontWeight: "300",
    opacity: 0.8,
    margin: 0,
    textShadow: "0 2px 5px rgba(0,0,0,0.5)",
  },
}
