import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"

// Tạo hiệu ứng post-processing
export const createPostProcessing = (renderer, scene, camera) => {
  // Add post-processing for glow effect
  const renderScene = new RenderPass(scene, camera)

  // Tối ưu hóa bloom pass
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.0, // Giảm strength
    0.4, // Radius
    0.1, // Threshold - lower threshold to capture more glow
  )

  // Add custom ethereal glow effect
  const etherealGlowPass = createEtherealGlowEffect()

  const composer = new EffectComposer(renderer)
  composer.addPass(renderScene)
  composer.addPass(bloomPass)
  composer.addPass(etherealGlowPass)

  return composer
}

// Custom post-processing effect for ethereal glow
const createEtherealGlowEffect = () => {
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      
      // Enhance the glow
      color.rgb = pow(color.rgb, vec3(0.85));
      
      // Add a subtle vignette effect
      vec2 uv = vUv * 2.0 - 1.0;
      float vignetteAmount = 1.0 - dot(uv, uv) * 0.3;
      color.rgb *= vignetteAmount;
      
      gl_FragColor = color;
    }
  `

  return new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
    },
    vertexShader,
    fragmentShader,
  })
}
