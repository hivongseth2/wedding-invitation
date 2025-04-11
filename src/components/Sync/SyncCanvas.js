"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { io } from "socket.io-client"
import WindowManager from "./utils/WindowManager"
import InteractionManager from "./utils/InteractionManager"
import { calculateWindowDirection, findPeerWindow } from "./utils/DirectionCalculator"
import { createLoveSphere, updateLoveSphere } from "./components/LoveSphere"
import { createEtherealConnection, updateEtherealConnection } from "./components/EtherealConnection"
import { createPostProcessing } from "./components/PostProcessing"

const LoveConnection = () => {
  // Refs for Three.js and Socket.io
  const mountRef = useRef(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const peersRef = useRef({})
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const composerRef = useRef(null)
  const cameraRef = useRef(null)
  const sphereRef = useRef(null)
  const connectionsRef = useRef({})
  const frameIdRef = useRef(null)
  const socketRef = useRef(null)
  const clockRef = useRef(new THREE.Clock())
  const mouseRef = useRef(new THREE.Vector2())
  const windowManagerRef = useRef(null)
  const interactionManagerRef = useRef(null)

  // State
  const [connectionCount, setConnectionCount] = useState(0)
  const [sphereColor, setSphereColor] = useState("")

  // Generate client and tab IDs
  const clientId = useRef(
    localStorage.getItem("love-client-id") ||
      (localStorage.setItem("love-client-id", Math.random().toString(36).slice(2, 9)),
      localStorage.getItem("love-client-id")),
  )
  const tabId = useRef(Math.random().toString(36).slice(2, 9))

  // Mảng màu sắc đẹp cho các quả cầu
  const sphereColors = [
    "#00ff88", // Xanh lá
    "#ff3366", // Hồng đỏ
    "#3366ff", // Xanh dương
    "#ff9900", // Cam
    "#cc33ff", // Tím
    "#00ccff", // Xanh biển
    "#ffcc00", // Vàng
  ]

  // Chọn màu ngẫu nhiên cho quả cầu
  const getRandomSphereColor = () => {
    return sphereColors[Math.floor(Math.random() * sphereColors.length)]
  }

  // Main effect for setting up Three.js scene and Socket.io connection
  useEffect(() => {
    // Initialize WindowManager
    const windowManager = new WindowManager()
    windowManager.init({ color: getRandomSphereColor() })
    windowManagerRef.current = windowManager

    // Chọn màu ngẫu nhiên cho quả cầu hiện tại
    const randomColor = windowManager.getThisWindowData().metaData.color || getRandomSphereColor()
    setSphereColor(randomColor)

    // Connect to Socket.io server
    const socket = io("http://localhost:3001", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })
    socketRef.current = socket

    // Khởi tạo InteractionManager
    const interactionManager = new InteractionManager(socket, clientId.current, tabId.current)
    interactionManagerRef.current = interactionManager

    // Socket event handlers
    socket.on("connect", () => {
      socket.emit("join", {
        clientId: clientId.current,
        tabId: tabId.current,
        color: randomColor,
      })
    
      // 👇 Thêm đoạn này để cập nhật metaData của window hiện tại
      windowManager.setMetaData({
        clientId: clientId.current,
        tabId: tabId.current,
        color: randomColor,
      })
    })
    

    socket.on("peer-count", (count) => {
      setConnectionCount(count)
    })

    socket.on("peer-joined", ({ clientId: peerId, tabId: peerTabId, color }) => {
      if (peerId !== clientId.current || peerTabId !== tabId.current) {
        peersRef.current[`${peerId}-${peerTabId}`] = {
          x: null,
          y: null,
          color: color || getRandomSphereColor(),
        }
        setConnectionCount(Object.keys(peersRef.current).length)
      }
    })

    socket.on("peer-left", ({ clientId: peerId, tabId: peerTabId }) => {
      const id = `${peerId}-${peerTabId}`

      delete peersRef.current[id]
      if (connectionsRef.current[id]) {
        sceneRef.current.remove(connectionsRef.current[id])
        connectionsRef.current[id].traverse((child) => {
          if (child.geometry) child.geometry.dispose()
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose())
            } else {
              child.material.dispose()
            }
          }
        })
        delete connectionsRef.current[id]
      }

      setConnectionCount(Object.keys(peersRef.current).length)
    })

    socket.on("peer-position", (data) => {
      const id = `${data.clientId}-${data.tabId}`
      if (id === `${clientId.current}-${tabId.current}`) return
    
      // Update peer data
      peersRef.current[id] = {
        ...peersRef.current[id],
        x: data.x,
        y: data.y,
        color: data.color || peersRef.current[id]?.color || getRandomSphereColor(),
      }
    
      const windows = windowManager.getWindows()
      const thisWindow = windowManager.getThisWindowData()
    
      if (!thisWindow || !thisWindow.shape || !thisWindow.metaData) {
        console.warn("This window chưa được init đúng:", thisWindow)
        return
      }
    
      const peerWindow = windows.find(
        (w) =>
          w.id !== thisWindow.id &&
          w.metaData?.clientId === data.clientId &&
          w.metaData?.tabId === data.tabId,
      )
    
      let dx, dy
    
      if (peerWindow && peerWindow.shape) {
        const direction = calculateWindowDirection(thisWindow, peerWindow)
        dx = direction.x
        dy = direction.y
    
 
      } else {
    
        // Fallback nếu không tìm thấy shape của peer
        dx = data.x - positionRef.current.x
        dy = data.y - positionRef.current.y
      }
    
      const startColor = sphereColor
      const endColor = peersRef.current[id].color

      if (data.x != null && data.y != null) {
        // Create or update energy stream
        updateOrCreateConnection(id, dx, dy, startColor, endColor)
      }
    })

    // Hàm tạo hoặc cập nhật kết nối
    const updateOrCreateConnection = (id, dx, dy, startColor, endColor) => {
      // Calculate positions in 3D space
      const start = new THREE.Vector3(0, 0, 0)
      const direction = new THREE.Vector3(dx, dy, 0).normalize()
      const distance = Math.sqrt(dx * dx + dy * dy)
      const scale = Math.min(distance / 200, 8)
      const end = direction.clone().multiplyScalar(scale)

      if (!connectionsRef.current[id] && sphereRef.current) {
        const stream = createEtherealConnection(start, end, startColor, endColor)
        connectionsRef.current[id] = stream
        sceneRef.current.add(stream)
      } else if (connectionsRef.current[id]) {
        // Update existing connection - recreate for smoother transitions
        sceneRef.current.remove(connectionsRef.current[id])
        connectionsRef.current[id].traverse((child) => {
          if (child.geometry) child.geometry.dispose()
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose())
            } else {
              child.material.dispose()
            }
          }
        })

        const stream = createEtherealConnection(start, end, startColor, endColor)
        connectionsRef.current[id] = stream
        sceneRef.current.add(stream)
      }
    }

    // Set up Three.js scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#000000") // Pure black background
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)) // Giới hạn pixel ratio để tăng hiệu suất
    rendererRef.current = renderer

    // Tạo post-processing
    const composer = createPostProcessing(renderer, scene, camera)
    composerRef.current = composer

    mountRef.current.appendChild(renderer.domElement)

    // Create sphere with current color
    const sphere = createLoveSphere(randomColor)
    sphereRef.current = sphere
    scene.add(sphere)

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate)

      const time = clockRef.current.getElapsedTime()

      // Lấy cường độ tương tác tổng hợp từ tất cả các nguồn
      const interactionIntensity = interactionManagerRef.current.getAggregateInteractionIntensity()

      // Cập nhật quả cầu
      updateLoveSphere(sphereRef.current, time, interactionIntensity, mouseRef.current.x, mouseRef.current.y)

      // Cập nhật các kết nối
      Object.values(connectionsRef.current).forEach((connection) => {
        updateEtherealConnection(connection, time, interactionIntensity)
      })

      // Update WindowManager
      windowManager.update()

      // Render scene with post-processing
      composer.render()
    }
    animate()

    // Update position and send to server
    const updatePosition = () => {
      const winData = windowManager.getThisWindowData()
      if (winData && winData.shape) {
        positionRef.current = {
          x: winData.shape.x + winData.shape.w / 2,
          y: winData.shape.y + winData.shape.h / 2,
        }

        socket.emit("position", {
          clientId: clientId.current,
          tabId: tabId.current,
          x: positionRef.current.x,
          y: positionRef.current.y,
          color: sphereColor,
        })
      }
    }

    // Set up intervals and event listeners
    const positionInterval = setInterval(updatePosition, 100)

    // Set window change callback
    windowManager.setWinShapeChangeCallback(updatePosition)
    windowManager.setWinChangeCallback(updatePosition)

    // Track mouse movement for interactive effects
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    // Handle mouse interactions
    const handleMouseEnter = () => {
      interactionManagerRef.current.updateLocalInteraction(true)
    }

    const handleMouseLeave = () => {
      interactionManagerRef.current.updateLocalInteraction(false)
    }

    const handleClick = () => {
      // Pulse effect on click
      if (sphereRef.current) {
        sphereRef.current.scale.set(1.2, 1.2, 1.2)

        // Broadcast click event to other windows
        socket.emit("interaction", {
          clientId: clientId.current,
          tabId: tabId.current,
          intensity: 1.0, // Full intensity for click
          type: "click",
        })

        setTimeout(() => {
          if (sphereRef.current) {
            sphereRef.current.scale.set(1, 1, 1)
          }
        }, 200)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    mountRef.current.addEventListener("mouseenter", handleMouseEnter)
    mountRef.current.addEventListener("mouseleave", handleMouseLeave)
    mountRef.current.addEventListener("click", handleClick)

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      composer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    // Cleanup function
    return () => {
      cancelAnimationFrame(frameIdRef.current)
      clearInterval(positionInterval)

      // Cleanup interaction manager
      if (interactionManagerRef.current) {
        interactionManagerRef.current.cleanup()
      }

      socket.off()
      socket.disconnect()
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      mountRef.current.removeEventListener("mouseenter", handleMouseEnter)
      mountRef.current.removeEventListener("mouseleave", handleMouseLeave)
      mountRef.current.removeEventListener("click", handleClick)

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }

      // Dispose resources
      if (sphereRef.current) {
        sphereRef.current.traverse((child) => {
          if (child.geometry) child.geometry.dispose()
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose())
            } else {
              child.material.dispose()
            }
          }
        })
      }

      Object.values(connectionsRef.current).forEach((connection) => {
        connection.traverse((child) => {
          if (child.geometry) child.geometry.dispose()
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose())
            } else {
              child.material.dispose()
            }
          }
        })
      })

      renderer.dispose()
      composer.dispose()
    }
  }, [])

  return (
    <div className="love-container">
      <div ref={mountRef} className="canvas" />

      {/* Connection status */}
      <div className="status">
        <div className="connection-icon">
          <div className={`heart-icon ${connectionCount > 0 ? "connected" : ""}`} />
        </div>
        <span className="connection-text">
          {connectionCount > 0 ? `Kết nối tình yêu đã được thiết lập` : "Đang chờ kết nối tình yêu..."}
        </span>
      </div>

      {/* Love quote */}
      {connectionCount > 0 && (
        <div className="love-quote">Tình yêu không phải là nhìn nhau, mà là cùng nhau nhìn về một hướng.</div>
      )}

      {/* Interaction hint */}
      <div className="interaction-hint">Di chuột qua quả cầu để tương tác</div>

      <style jsx>{`
        .love-container {
          width: 100vw;
          height: 100vh;
          background: #000000;
          overflow: hidden;
          position: relative;
          font-family: 'Helvetica Neue', Arial, sans-serif;
        }
        
        .canvas {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          cursor: pointer;
        }
        
        .status {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 20px;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          z-index: 10;
          transition: all 0.5s ease;
        }

        .connection-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }

        .heart-icon {
          width: 20px;
          height: 18px;
          background-color: rgba(255, 255, 255, 0.5);
          position: relative;
          transform: rotate(-45deg);
          transition: all 0.5s ease;
        }

        .heart-icon:before,
        .heart-icon:after {
          content: "";
          width: 20px;
          height: 18px;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          position: absolute;
        }

        .heart-icon:before {
          top: -9px;
          left: 0;
        }

        .heart-icon:after {
          top: 0;
          left: 9px;
        }

        .heart-icon.connected {
          background-color: ${sphereColor};
          animation: pulse 1.5s infinite ease-in-out;
        }

        .heart-icon.connected:before,
        .heart-icon.connected:after {
          background-color: ${sphereColor};
        }
        
        .connection-text {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          font-weight: 300;
          letter-spacing: 0.5px;
        }
        
        .love-quote {
          position: absolute;
          top: 30px;
          left: 50%;
          transform: translateX(-50%);
          padding: 12px 24px;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          font-style: italic;
          text-align: center;
          max-width: 80%;
          opacity: 0;
          animation: fadeIn 1s forwards 0.5s;
          z-index: 10;
        }
        
        .interaction-hint {
          position: absolute;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          opacity: 0.7;
          text-align: center;
          animation: fadeInOut 3s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: rotate(-45deg) scale(1); }
          50% { transform: rotate(-45deg) scale(1.2); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}

export default LoveConnection
