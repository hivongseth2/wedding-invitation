// SyncCanvas.js (FIXED: Camera instance bug)
"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import io from "socket.io-client"
import WindowManager from "./WindowManager"

const LoveConnection = () => {
  const mountRef = useRef(null)
  const positionRef = useRef({ x: window.screenX, y: window.screenY })
  const peersRef = useRef({})
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const heartRef = useRef(null)
  const connectionsRef = useRef({})
  const frameIdRef = useRef(null)
  const particlesRef = useRef(null)
  const transferParticlesRef = useRef({})
  const socketRef = useRef(null)
  const windowManagerRef = useRef(null)
  const cubesRef = useRef([])

  const [isFirstHeart, setIsFirstHeart] = useState(true)
  const [connectionDetected, setConnectionDetected] = useState(false)
  const [connectionCount, setConnectionCount] = useState(0)
  const [energyExchange, setEnergyExchange] = useState(false)
  const [windowData, setWindowData] = useState(null)

  const getOrCreateClientId = () => {
    let id = localStorage.getItem("love-client-id")
    if (!id) {
      id = Math.random().toString(36).substring(2, 9)
      localStorage.setItem("love-client-id", id)
    }
    return id
  }

  const clientId = useRef(getOrCreateClientId())
  const tabId = useRef(Math.random().toString(36).substring(2, 9))

  const setupScene = () => {
    const width = window.innerWidth
    const height = window.innerHeight

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(0, width, height, 0, -10000, 10000)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)

    const world = new THREE.Object3D()
    scene.add(world)

    mountRef.current.appendChild(renderer.domElement)

    sceneRef.current = scene
    rendererRef.current = renderer
    heartRef.current = world
  }

  const updateCubes = () => {
    const world = heartRef.current
    const cubes = cubesRef.current
    const wins = windowManagerRef.current.getWindows()

    cubes.forEach(c => world.remove(c))
    cubesRef.current = []

    for (let i = 0; i < wins.length; i++) {
      const win = wins[i]
      const color = new THREE.Color()
      color.setHSL(i * 0.1, 1.0, 0.5)

      const size = 80 + i * 40
      const geometry = new THREE.BoxGeometry(size, size, size)
      const material = new THREE.MeshBasicMaterial({ color, wireframe: true })
      const cube = new THREE.Mesh(geometry, material)

      cube.position.x = win.shape.x + win.shape.w / 2
      cube.position.y = win.shape.y + win.shape.h / 2

      world.add(cube)
      cubesRef.current.push(cube)
    }
  }

  const animateCubes = (time) => {
    const wins = windowManagerRef.current?.getWindows() || []
    const cubes = cubesRef.current
    const falloff = 0.05

    for (let i = 0; i < cubes.length; i++) {
      const cube = cubes[i]
      const win = wins[i]
      if (!win) continue

      const targetX = win.shape.x + win.shape.w / 2
      const targetY = win.shape.y + win.shape.h / 2

      cube.position.x += (targetX - cube.position.x) * falloff
      cube.position.y += (targetY - cube.position.y) * falloff
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
    }
  }

  useEffect(() => {
    const windowManager = new WindowManager()
    windowManagerRef.current = windowManager
    windowManager.setWinShapeChangeCallback(updateCubes)
    windowManager.setWinChangeCallback(updateCubes)
    windowManager.init({ mood: "romantic" })
    setWindowData(windowManager.getThisWindowData())

    setupScene()
    updateCubes()

    const socket = io("http://localhost:3001", {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
      transports: ["websocket"],
      forceNew: true,
      pingInterval: 2000,
      pingTimeout: 5000,
    })

    socketRef.current = socket

    socket.on("connect", () => {
      socket.emit("join", {
        clientId: clientId.current,
        tabId: tabId.current,
      })
      socket.emit("get-peers")
    })

    socket.on("peers", (peers) => {
      const filtered = peers.filter(
        (p) => p.clientId !== clientId.current || p.tabId !== tabId.current
      )
      setConnectionCount(filtered.length)
    })

    socket.on("peer-joined", () => {
      setConnectionDetected(true)
      setTimeout(() => setConnectionDetected(false), 3000)
    })

    socket.on("peer-left", () => {
      socket.emit("get-peers")
    })

    const sendPosition = () => {
      const shape = windowManagerRef.current?.getThisWindowData()?.shape || {}
      positionRef.current = { x: shape.x || 0, y: shape.y || 0 }

      socket.emit("position", {
        clientId: clientId.current,
        tabId: tabId.current,
        x: positionRef.current.x,
        y: positionRef.current.y,
        isFirstHeart: isFirstHeart,
      })
    }

    const pingInterval = setInterval(() => {
      socket.emit("ping", {
        clientId: clientId.current,
        tabId: tabId.current,
      })
    }, 5000)

    const animate = (time) => {
      frameIdRef.current = requestAnimationFrame(animate)
      windowManagerRef.current?.update()
      sendPosition()
      animateCubes(time)
      rendererRef.current?.render(sceneRef.current, cameraRef.current)
    }

    animate()

    return () => {
      cancelAnimationFrame(frameIdRef.current)
      clearInterval(pingInterval)

      socket.emit("leave", {
        clientId: clientId.current,
        tabId: tabId.current,
      })

      socket.disconnect()
      if (rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement)
      }
    }
  }, [])

  return (
    <div ref={mountRef} className="love-container">
      <div className="connection-status">
        <div className="status-icon">
          <div className={`pulse ${connectionCount > 0 ? "active" : ""}`}></div>
        </div>
        <div className="status-text">
          {connectionCount > 0
            ? `Connected with ${connectionCount} heart${connectionCount > 1 ? "s" : ""}`
            : "Waiting for connection..."}
        </div>
      </div>
    </div>
  )
}

export default LoveConnection;
