// Trong BlackHoleEffect.js
import * as THREE from "three"

export const createBlackHoleEffect = (position, endPosition, startColor, endColor, progress = 0) => {
  const group = new THREE.Group();
  group.position.copy(position);

  // Tạo vortex
  const vortexGeometry = new THREE.TorusGeometry(0.3, 0.1, 16, 50); // Giảm phân giải để tối ưu
  const vortexMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      startColor: { value: new THREE.Color(startColor) },
      endColor: { value: new THREE.Color(endColor) },
      progress: { value: progress },
    },
    vertexShader: `
      uniform float time;
      uniform float progress;
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vPosition = position;
        float angle = atan(position.y, position.x);
        float radius = length(position.xy);
        float spiralFactor = progress * 1.5;
        float newAngle = angle + time * 1.5 + radius * spiralFactor;
        vec3 newPosition = position;
        newPosition.x = cos(newAngle) * radius;
        newPosition.y = sin(newAngle) * radius;
        float shrinkFactor = 1.0 - progress * 0.4;
        newPosition.xy *= shrinkFactor;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 startColor;
      uniform vec3 endColor;
      uniform float progress;
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vec3 color = mix(startColor, endColor, progress);
        float pulse = 0.9 + 0.1 * sin(time * 2.0);
        float opacity = 0.3 + progress * 0.7;
        gl_FragColor = vec4(color, opacity * pulse);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const vortex = new THREE.Mesh(vortexGeometry, vortexMaterial);
  vortex.rotation.x = Math.PI / 2;
  group.add(vortex);

  // Animation update
  group.userData.update = (time) => {
    vortexMaterial.uniforms.time.value = time;
    const newProgress = Math.min(vortexMaterial.uniforms.progress.value + 0.03, 1.0);
    vortexMaterial.uniforms.progress.value = newProgress;
  };

  return group;
};

export const updateBlackHoleEffect = (blackHole, time) => {
  if (!blackHole || !blackHole.userData.update) return;
  blackHole.userData.update(time);
  blackHole.scale.set(2, 2, 2); // Giảm scale để tránh che khuất
};