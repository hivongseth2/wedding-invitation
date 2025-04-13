// src/components/Sync/SyncCanvas.js
"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import WindowManager from "../utils/WindowManager";

const SharedView = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const frameIdRef = useRef(null);
  const mainSphereRef = useRef(null);
  const peerSpheresRef = useRef({});
  const connectionsRef = useRef({});
  const mouseRef = useRef({ x: 0, y: 0 });
  const windowManagerRef = useRef(null);
  const lastPositionUpdate = useRef(0);
  const positionUpdateThrottle = 100; // Throttle updates to 100ms

  const [sphereColor, setSphereColor] = useState("#00ff88");

  // Simplified LoveSphere
  const createLoveSphere = (color, radius = 1) => {
    const geometry = new THREE.SphereGeometry(radius, 16, 16); // Lower segments
    const material = new THREE.MeshBasicMaterial({ color });
    return new THREE.Mesh(geometry, material);
  };

  // Simplified EtherealConnection
  const createEtherealConnection = (start, end, startColor, endColor) => {
    const group = new THREE.Group();
    if (!start || !end || start.x === undefined || end.x === undefined) return group;

    const particleCount = 50; // Reduced
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const t = i / (particleCount - 1);
      const pos = new THREE.Vector3().lerpVectors(start, end, t);
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;

      const color = new THREE.Color(startColor).lerp(new THREE.Color(endColor), t);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    group.add(particles);
    return group;
  };

  useEffect(() => {
    // Initialize WindowManager
    windowManagerRef.current = new WindowManager();

    // Initialize scene
    const scene = sceneRef.current;
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1); // Lower pixel ratio
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create main sphere
    const mainSphere = createLoveSphere(sphereColor);
    mainSphere.position.set(0, 0, 0);
    scene.add(mainSphere);
    mainSphereRef.current = mainSphere;

    // Save initial sphere data
    windowManagerRef.current.setMetaData({
      sphere: {
        x: 0,
        y: 0,
        z: 0,
        color: sphereColor,
      },
    });

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Handle storage events
    const handleStorage = (event) => {
      if (event.key === "windows") {
        const windows = JSON.parse(event.newValue || "[]");
        updatePeers(windows);
      }
    };
    window.addEventListener("storage", handleStorage);

    // Periodic sync
    const syncInterval = setInterval(() => {
      const windows = JSON.parse(localStorage.getItem("windows") || "[]");
      updatePeers(windows);
    }, 200); // Faster sync

    // Dragging logic
    let isDragging = false;

    const handleMouseDown = (event) => {
      isDragging = true;
    };

    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      if (isDragging && mainSphereRef.current) {
        const vector = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, 0.5);
        vector.unproject(cameraRef.current);
        const dir = vector.sub(cameraRef.current.position).normalize();
        const distance = -cameraRef.current.position.z / dir.z;
        const pos = cameraRef.current.position.clone().add(dir.multiplyScalar(distance));

        const screenX = event.screenX;
        const screenY = event.screenY;

        const windows = windowManagerRef.current.getWindows();
        const currentWindow = windowManagerRef.current.getThisWindowData();

        let movedToOtherTab = false;

        windows.forEach((win) => {
          if (
            win.id !== currentWindow.id &&
            screenX >= win.shape.x &&
            screenX <= win.shape.x + win.shape.w &&
            screenY >= win.shape.y &&
            screenY <= win.shape.y + win.shape.h
          ) {
            win.metaData.sphere = {
              x: pos.x,
              y: pos.y,
              z: 0,
              color: sphereColor,
            };
            sceneRef.current.remove(mainSphereRef.current);
            mainSphereRef.current = null;
            windowManagerRef.current.setMetaData({ sphere: null });
            movedToOtherTab = true;
            windowManagerRef.current.saveWindows();
          }
        });

        if (!movedToOtherTab && mainSphereRef.current) {
          mainSphereRef.current.position.set(pos.x, pos.y, 0);
          const now = Date.now();
          if (now - lastPositionUpdate.current >= positionUpdateThrottle) {
            windowManagerRef.current.setMetaData({
              sphere: {
                x: pos.x,
                y: pos.y,
                z: 0,
                color: sphereColor,
              },
            });
            lastPositionUpdate.current = now;
          }

          Object.keys(peerSpheresRef.current).forEach((peerId) => {
            const peerPosition = peerSpheresRef.current[peerId].sphere.position;
            updateConnection(peerId, peerPosition);
          });
        }
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    mountRef.current.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const time = clockRef.current.getElapsedTime();

      // Orbiting logic
      if (mainSphereRef.current && Object.keys(peerSpheresRef.current).length > 0) {
        const peerIds = Object.keys(peerSpheresRef.current);
        const firstPeerId = peerIds[0];
        const peerSphere = peerSpheresRef.current[firstPeerId]?.sphere;

        if (peerSphere) {
          const center = new THREE.Vector3()
            .addVectors(mainSphereRef.current.position, peerSphere.position)
            .multiplyScalar(0.5);
          const orbitRadius = mainSphereRef.current.position.distanceTo(peerSphere.position) / 2;
          const orbitSpeed = 0.5;
          const mainAngle = time * orbitSpeed;

          mainSphereRef.current.position.set(
            center.x + Math.cos(mainAngle) * orbitRadius,
            center.y + Math.sin(mainAngle) * orbitRadius,
            0
          );

          const peerAngle = mainAngle + Math.PI;
          peerSphere.position.set(
            center.x + Math.cos(peerAngle) * orbitRadius,
            center.y + Math.sin(peerAngle) * orbitRadius,
            0
          );

          const now = Date.now();
          if (now - lastPositionUpdate.current >= positionUpdateThrottle) {
            windowManagerRef.current.setMetaData({
              sphere: {
                x: mainSphereRef.current.position.x,
                y: mainSphereRef.current.position.y,
                z: 0,
                color: sphereColor,
              },
            });
            lastPositionUpdate.current = now;
          }

          updateConnection(firstPeerId, peerSphere.position);
        }
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      clearInterval(syncInterval);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("mousemove", handleMouseMove);
      mountRef.current.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      if (mountRef.current && rendererRef.current.domElement) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current.dispose();
    };
  }, []);

  // Update peers
  const updatePeers = (windows) => {
    const currentWindowId = windowManagerRef.current.getThisWindowData().id;
    const newPeerSpheres = {};

    windows.forEach((win) => {
      if (win.id !== currentWindowId && win.metaData?.sphere) {
        const peerId = win.id;
        if (!peerSpheresRef.current[peerId]) {
          const sphere = createLoveSphere(win.metaData.sphere.color || "#ffffff");
          sphere.position.set(
            win.metaData.sphere.x || 0,
            win.metaData.sphere.y || 0,
            win.metaData.sphere.z || 0
          );
          sceneRef.current.add(sphere);
          newPeerSpheres[peerId] = { sphere, color: win.metaData.sphere.color };
          if (mainSphereRef.current) {
            createConnection(peerId, sphere.position);
          }
        } else {
          newPeerSpheres[peerId] = peerSpheresRef.current[peerId];
          newPeerSpheres[peerId].sphere.position.set(
            win.metaData.sphere.x || 0,
            win.metaData.sphere.y || 0,
            win.metaData.sphere.z || 0
          );
          if (mainSphereRef.current) {
            updateConnection(peerId, newPeerSpheres[peerId].sphere.position);
          }
        }
      }
    });

    Object.keys(peerSpheresRef.current).forEach((peerId) => {
      if (!newPeerSpheres[peerId]) {
        sceneRef.current.remove(peerSpheresRef.current[peerId].sphere);
        if (connectionsRef.current[peerId]) {
          sceneRef.current.remove(connectionsRef.current[peerId]);
          delete connectionsRef.current[peerId];
        }
      }
    });

    peerSpheresRef.current = newPeerSpheres;

    // Handle transferred sphere
    const currentWindow = windowManagerRef.current.getThisWindowData();
    if (currentWindow.metaData?.sphere && !mainSphereRef.current) {
      const newSphere = createLoveSphere(currentWindow.metaData.sphere.color);
      newSphere.position.set(
        currentWindow.metaData.sphere.x || 0,
        currentWindow.metaData.sphere.y || 0,
        currentWindow.metaData.sphere.z || 0
      );
      sceneRef.current.add(newSphere);
      mainSphereRef.current = newSphere;
      setSphereColor(currentWindow.metaData.sphere.color);
      Object.keys(peerSpheresRef.current).forEach((peerId) => {
        const peerPosition = peerSpheresRef.current[peerId].sphere.position;
        createConnection(peerId, peerPosition);
      });
    }
  };

  // Update connection
  const updateConnection = (peerId, peerPosition) => {
    if (!mainSphereRef.current || !peerPosition) return;

    if (connectionsRef.current[peerId]) {
      sceneRef.current.remove(connectionsRef.current[peerId]);
      delete connectionsRef.current[peerId];
    }

    const mainPosition = mainSphereRef.current.position;
    const peerColor = peerSpheresRef.current[peerId]?.color || "#ffffff";
    const connection = createEtherealConnection(mainPosition, peerPosition, sphereColor, peerColor);
    if (connection.children.length > 0) {
      sceneRef.current.add(connection);
      connectionsRef.current[peerId] = connection;
    }
  };

  // Merge logic
  const handleClick = () => {
    if (!mainSphereRef.current) return;

    const mainPos = mainSphereRef.current.position;
    let closestPeerId = null;
    let closestDistance = Infinity;

    Object.entries(peerSpheresRef.current).forEach(([peerId, peerData]) => {
      if (peerData.sphere) {
        const distance = mainPos.distanceTo(peerData.sphere.position);
        if (distance < closestDistance && distance < 3) {
          closestDistance = distance;
          closestPeerId = peerId;
        }
      }
    });

    if (closestPeerId) {
      const targetColor = peerSpheresRef.current[closestPeerId].color || "#ffffff";
      const color1 = new THREE.Color(sphereColor);
      const color2 = new THREE.Color(targetColor);
      const mergedColor = new THREE.Color(
        (color1.r + color2.r) / 2,
        (color1.g + color2.g) / 2,
        (color1.b + color2.b) / 2
      );

      const newColorHex = "#" + mergedColor.getHexString();
      setSphereColor(newColorHex);

      // Simple particle effect
      const particleCount = 100;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 1;
        const theta = Math.random() * Math.PI * 2;
        positions[i * 3] = radius * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(theta);
        positions[i * 3 + 2] = 0;

        const t = Math.random();
        const color = new THREE.Color().lerpColors(color1, color2, t);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
      });

      const particles = new THREE.Points(geometry, material);
      sceneRef.current.add(particles);

      // Remove peer
      if (peerSpheresRef.current[closestPeerId]) {
        sceneRef.current.remove(peerSpheresRef.current[closestPeerId].sphere);
        delete peerSpheresRef.current[closestPeerId];
        const windows = windowManagerRef.current.getWindows();
        const peerWindow = windows.find((win) => win.id === closestPeerId);
        if (peerWindow) {
          peerWindow.metaData.sphere = null;
          windowManagerRef.current.saveWindows();
        }
      }
      if (connectionsRef.current[closestPeerId]) {
        sceneRef.current.remove(connectionsRef.current[closestPeerId]);
        delete connectionsRef.current[closestPeerId];
      }

      // Update main sphere
      sceneRef.current.remove(mainSphereRef.current);
      const newSphere = createLoveSphere(newColorHex, 1.5);
      newSphere.position.copy(mainPos);
      sceneRef.current.add(newSphere);
      mainSphereRef.current = newSphere;

      windowManagerRef.current.setMetaData({
        sphere: {
          x: mainPos.x,
          y: mainPos.y,
          z: 0,
          color: newColorHex,
        },
      });

      // Remove particles after 1 second
      setTimeout(() => {
        sceneRef.current.remove(particles);
        geometry.dispose();
        material.dispose();
      }, 1000);
    }
  };

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
      onClick={handleClick}
    />
  );
};

export default SharedView;