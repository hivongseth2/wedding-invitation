// src/components/Sync/components/EtherealGlowEffect.js
import * as THREE from "three";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

export const createEtherealGlowEffect = () => {
  const shader = {
    uniforms: {
      tDiffuse: { value: null },
      time: { value: 0 },
      glowIntensity: { value: 0.5 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float time;
      uniform float glowIntensity;
      varying vec2 vUv;
      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        float glow = sin(time) * 0.5 + 0.5;
        color.rgb += color.rgb * glow * glowIntensity;
        gl_FragColor = color;
      }
    `,
  };

  const pass = new ShaderPass(shader);
  pass.renderToScreen = true;
  return pass;
};