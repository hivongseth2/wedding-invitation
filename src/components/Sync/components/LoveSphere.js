import * as THREE from "three"

// Tạo quả cầu tình yêu với hiệu ứng phát sáng
export const createLoveSphere = (color = "#ff3366", radius = 1, particleCount = 800) => {
  const group = new THREE.Group()

  // Core sphere - đơn giản hóa geometry
  const sphereGeometry = new THREE.SphereGeometry(radius * 0.4, 24, 24)
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.15,
  })
  const coreSphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  group.add(coreSphere)

  // Inner glow - shader đơn giản hóa
  const innerGlowGeometry = new THREE.SphereGeometry(radius * 0.6, 24, 24)
  const innerGlowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(color) },
      time: { value: 0 },
      interactionIntensity: { value: 0 },
    },
    vertexShader: `
      varying vec3 vNormal;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float time;
      uniform float interactionIntensity;
      varying vec3 vNormal;
      
      void main() {
        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        float pulse = 0.9 + 0.1 * sin(time * 2.0);
        
        // Add interaction glow effect
        float interactionGlow = 1.0 + interactionIntensity * 0.5;
        
        vec3 glow = color * intensity * pulse * interactionGlow;
        gl_FragColor = vec4(glow, intensity * (0.4 + interactionIntensity * 0.2));
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  })
  const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial)
  group.add(innerGlow)

  // Outer glow - đơn giản hóa
  const outerGlowGeometry = new THREE.SphereGeometry(radius * 1.2, 24, 24)
  const outerGlowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(color) },
      time: { value: 0 },
      interactionIntensity: { value: 0 },
    },
    vertexShader: `
      varying vec3 vNormal;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float time;
      uniform float interactionIntensity;
      varying vec3 vNormal;
      
      void main() {
        float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
        float pulse = 0.95 + 0.05 * sin(time * 1.5);
        
        // Add interaction glow effect
        float interactionGlow = 1.0 + interactionIntensity * 0.7;
        
        vec3 glow = color * intensity * pulse * interactionGlow;
        gl_FragColor = vec4(glow, intensity * (0.2 + interactionIntensity * 0.3));
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
  })
  const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial)
  group.add(outerGlow)

  // Particle system - giảm số lượng hạt
  const particles = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)
  const angles = new Float32Array(particleCount)
  const speeds = new Float32Array(particleCount)
  const baseColor = new THREE.Color(color)

  for (let i = 0; i < particleCount; i++) {
    // Create particles in a spherical distribution
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    // Random radius with more particles near the surface
    const r = radius * (0.6 + Math.pow(Math.random(), 2) * 0.9)

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    // Distance from center affects color and size
    const distFromCenter = r / radius
    const intensity = Math.max(0, 1 - distFromCenter)

    colors[i * 3] = baseColor.r
    colors[i * 3 + 1] = baseColor.g
    colors[i * 3 + 2] = baseColor.b

    // Make particles extremely small
    sizes[i] = 0.003 + Math.random() * 0.005
    angles[i] = Math.random() * Math.PI * 2
    speeds[i] = 0.1 + Math.random() * 0.3
  }

  particles.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  particles.setAttribute("color", new THREE.BufferAttribute(colors, 3))
  particles.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
  particles.setAttribute("angle", new THREE.BufferAttribute(angles, 1))
  particles.setAttribute("speed", new THREE.BufferAttribute(speeds, 1))

  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(color) },
      interactionIntensity: { value: 0 },
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      attribute float angle;
      attribute float speed;
      
      uniform float time;
      uniform float interactionIntensity;
      
      varying vec3 vColor;
      
      void main() {
        vColor = color;
        
        // Add subtle movement to particles
        vec3 pos = position;
        float noise = sin(time * speed + angle) * 0.03;
        
        // Add interaction effect - particles move outward when interacting
        float interactionEffect = 1.0 + interactionIntensity * 0.2;
        
        pos += normalize(pos) * (noise + interactionIntensity * 0.05);
        pos *= interactionEffect;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + interactionIntensity * 0.5);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float interactionIntensity;
      varying vec3 vColor;
      
      void main() {
        // Create a soft, circular particle
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        
        // Softer edge for particles
        float opacity = 1.0 - smoothstep(0.3, 0.5, dist);
        
        // Increase brightness with interaction
        vec3 brightColor = vColor * (1.0 + interactionIntensity * 0.5);
        
        gl_FragColor = vec4(brightColor, opacity * (0.3 + interactionIntensity * 0.2));
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  const particleSystem = new THREE.Points(particles, particleMaterial)
  group.add(particleSystem)

  return group
}

// Cập nhật animation cho quả cầu
export const updateLoveSphere = (sphere, time, interactionIntensity, mouseX, mouseY) => {
  if (!sphere) return

  // Update inner glow
  if (sphere.children[1]?.material.uniforms) {
    sphere.children[1].material.uniforms.time.value = time
    sphere.children[1].material.uniforms.interactionIntensity.value = interactionIntensity
  }

  // Update outer glow
  if (sphere.children[2]?.material.uniforms) {
    sphere.children[2].material.uniforms.time.value = time
    sphere.children[2].material.uniforms.interactionIntensity.value = interactionIntensity
  }

  // Update particle system
  if (sphere.children[3]?.material.uniforms) {
    sphere.children[3].material.uniforms.time.value = time
    sphere.children[3].material.uniforms.interactionIntensity.value = interactionIntensity
  }

  // Add subtle floating motion to the sphere
  sphere.position.y = Math.sin(time * 0.5) * 0.1

  // Add rotation that's enhanced during interaction
  const baseRotation = time * 0.1
  const interactionRotation = interactionIntensity * 0.2
  sphere.rotation.y = baseRotation + interactionRotation
  sphere.rotation.x = Math.sin(time * 0.3) * 0.05 + mouseY * 0.2
  sphere.rotation.z = Math.cos(time * 0.4) * 0.05 + mouseX * 0.2
}
