import * as THREE from "three"

// Tạo kết nối ethereal giữa hai điểm
export const createEtherealConnection = (start, end, startColor, endColor, count = 1000) => {
  // Create a group to hold all connection elements
  const group = new THREE.Group()

  // Calculate control points for a curved path
  const direction = new THREE.Vector3().subVectors(end, start)
  const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)

  // Add some height to the curve
  const perpendicular = new THREE.Vector3(0, 1, 0)
  if (Math.abs(direction.y) > 0.9) {
    perpendicular.set(1, 0, 0)
  }

  const normal = new THREE.Vector3().crossVectors(direction, perpendicular).normalize()
  const curveHeight = direction.length() * 0.3 // Moderate curve height

  // Create multiple control points for a more complex curve
  const controlPoints = []

  // Add start point
  controlPoints.push(start.clone())

  // Add intermediate points with slight variations
  const numIntermediatePoints = 6 // Giảm số điểm để tối ưu
  for (let i = 1; i < numIntermediatePoints; i++) {
    const t = i / numIntermediatePoints

    // Base point along the line
    const basePoint = new THREE.Vector3().lerpVectors(start, end, t)

    // Add some curvature
    // Use sine wave for natural curve
    const curveOffset = Math.sin(t * Math.PI) * curveHeight

    // Add some randomness to each control point
    const randomOffset = (Math.random() - 0.5) * 0.1

    // Create the control point with offset
    const controlPoint = basePoint.clone().add(normal.clone().multiplyScalar(curveOffset + randomOffset))

    controlPoints.push(controlPoint)
  }

  // Add end point
  controlPoints.push(end.clone())

  // Create a smooth curve through all control points
  const curve = new THREE.CatmullRomCurve3(controlPoints)
  curve.tension = 0.1 // Lower tension for smoother curve

  // Create particles along the curve
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const opacities = new Float32Array(count)
  const offsets = new Float32Array(count)
  const speeds = new Float32Array(count)

  const startColorObj = new THREE.Color(startColor)
  const endColorObj = new THREE.Color(endColor)

  // Sample points along the curve for reference
  const curvePoints = curve.getPoints(50) // Giảm số điểm lấy mẫu

  for (let i = 0; i < count; i++) {
    // Random position along the curve
    const t = Math.random()
    const curvePoint = curve.getPointAt(t)

    // Add some randomness to position
    // More randomness in the middle, less at endpoints
    const spreadFactor = Math.sin(t * Math.PI) * 0.2

    // Random distance from curve
    const randomAngle = Math.random() * Math.PI * 2
    const randomRadius = Math.random() * spreadFactor

    // Calculate offset direction (perpendicular to curve)
    const tangent = curve.getTangentAt(t)
    const normal = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize()
    const binormal = new THREE.Vector3().crossVectors(tangent, normal)

    // Create position with randomness in all directions
    const pos = curvePoint.clone()
    pos.add(normal.clone().multiplyScalar(Math.cos(randomAngle) * randomRadius))
    pos.add(binormal.clone().multiplyScalar(Math.sin(randomAngle) * randomRadius))

    positions[i * 3] = pos.x
    positions[i * 3 + 1] = pos.y
    positions[i * 3 + 2] = pos.z

    // Interpolate color based on position
    const colorT = t
    const color = new THREE.Color().lerpColors(startColorObj, endColorObj, colorT)

    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    // Extremely small particles for a misty effect
    // Vary size based on distance from curve center
    const sizeVariation = 1.0 - (0.5 * Math.random() * randomRadius) / spreadFactor
    sizes[i] = (0.002 + Math.random() * 0.003) * sizeVariation

    // Vary opacity - more transparent at edges
    opacities[i] = 0.1 + 0.2 * sizeVariation * Math.random()

    // Random offset for animation
    offsets[i] = Math.random() * Math.PI * 2

    // Random speed for each particle
    speeds[i] = 0.1 + Math.random() * 0.4
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute("opacity", new THREE.BufferAttribute(opacities, 1))
  geometry.setAttribute("offset", new THREE.BufferAttribute(offsets, 1))
  geometry.setAttribute("speed", new THREE.BufferAttribute(speeds, 1))

  // Đơn giản hóa shader
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      interactionIntensity: { value: 0 },
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      attribute float opacity;
      attribute float offset;
      attribute float speed;
      
      uniform float time;
      uniform float interactionIntensity;
      
      varying vec3 vColor;
      varying float vOpacity;
      
      void main() {
        vColor = color;
        vOpacity = opacity * (1.0 + interactionIntensity * 0.5);
        
        // Add subtle movement to particles
        vec3 pos = position;
        
        // Simple noise based on time and offset
        float noise = sin(time * speed + offset) * 0.02;
        
        // Apply noise perpendicular to the direction to the center
        vec3 toCenter = normalize(vec3(0.0, 0.0, 0.0) - position);
        vec3 perpendicular = normalize(cross(toCenter, vec3(0.0, 1.0, 0.0)));
        
        pos += perpendicular * noise * (1.0 + interactionIntensity * 0.3);
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + interactionIntensity * 0.3);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float interactionIntensity;
      varying vec3 vColor;
      varying float vOpacity;
      
      void main() {
        // Create a soft, glowing particle
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        
        // Softer edge with custom falloff
        float edge = smoothstep(0.5, 0.1, dist);
        float finalOpacity = vOpacity * edge;
        
        // Enhance color with interaction
        vec3 brightColor = vColor * (1.0 + interactionIntensity * 0.3);
        
        gl_FragColor = vec4(brightColor, finalOpacity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  const particles = new THREE.Points(geometry, material)
  group.add(particles)

  // Add a subtle volumetric light effect - đơn giản hóa
  const volumetricLightGeometry = new THREE.TubeGeometry(curve, 32, 0.02, 8, false)
  const volumetricLightMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      startColor: { value: new THREE.Color(startColor) },
      endColor: { value: new THREE.Color(endColor) },
      interactionIntensity: { value: 0 },
    },
    vertexShader: `
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        vPosition = position;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 startColor;
      uniform vec3 endColor;
      uniform float interactionIntensity;
      
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        // Interpolate between start and end colors
        vec3 color = mix(startColor, endColor, vUv.x);
        
        // Add subtle pulsing
        float pulse = 0.7 + 0.3 * sin(time * 2.0 + vUv.x * 10.0);
        
        // Fade at edges
        float edge = 1.0 - 2.0 * abs(vUv.y - 0.5);
        edge = pow(edge, 2.0);
        
        // Enhance with interaction
        float interactionEffect = 1.0 + interactionIntensity * 0.5;
        color *= interactionEffect;
        
        float opacity = (0.05 + interactionIntensity * 0.03) * pulse * edge;
        
        gl_FragColor = vec4(color, opacity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  })

  const volumetricLight = new THREE.Mesh(volumetricLightGeometry, volumetricLightMaterial)
  group.add(volumetricLight)

  return group
}

// Cập nhật animation cho kết nối
export const updateEtherealConnection = (connection, time, interactionIntensity) => {
  if (!connection) return

  connection.traverse((child) => {
    if (child.material && child.material.uniforms) {
      if (child.material.uniforms.time) {
        child.material.uniforms.time.value = time
      }
      if (child.material.uniforms.interactionIntensity) {
        child.material.uniforms.interactionIntensity.value = interactionIntensity
      }
    }
  })
}
