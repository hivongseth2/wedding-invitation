"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateLoveSphere = exports.createLoveSphere = void 0;

var THREE = _interopRequireWildcard(require("three"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Tạo quả cầu tình yêu
var createLoveSphere = function createLoveSphere(color) {
  // Tạo geometry cho quả cầu
  var geometry = new THREE.SphereGeometry(0.5, 32, 32); // Tạo shader material cho hiệu ứng phát sáng và chuyển động

  var material = new THREE.ShaderMaterial({
    uniforms: {
      time: {
        value: 0
      },
      color: {
        value: new THREE.Color(color)
      },
      intensity: {
        value: 0.5
      },
      mouseX: {
        value: 0
      },
      mouseY: {
        value: 0
      }
    },
    vertexShader: "\n      uniform float time;\n      uniform float intensity;\n      uniform float mouseX;\n      uniform float mouseY;\n      \n      varying vec2 vUv;\n      varying vec3 vNormal;\n      varying vec3 vPosition;\n      \n      // Simplex noise function\n      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\n      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\n      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }\n      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }\n      float snoise(vec3 v) {\n        const vec2 C = vec2(1.0/6.0, 1.0/3.0);\n        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);\n        \n        // First corner\n        vec3 i  = floor(v + dot(v, C.yyy));\n        vec3 x0 = v - i + dot(i, C.xxx);\n        \n        // Other corners\n        vec3 g = step(x0.yzx, x0.xyz);\n        vec3 l = 1.0 - g;\n        vec3 i1 = min(g.xyz, l.zxy);\n        vec3 i2 = max(g.xyz, l.zxy);\n        \n        vec3 x1 = x0 - i1 + C.xxx;\n        vec3 x2 = x0 - i2 + C.yyy;\n        vec3 x3 = x0 - D.yyy;\n        \n        // Permutations\n        i = mod289(i);\n        vec4 p = permute(permute(permute(\n                i.z + vec4(0.0, i1.z, i2.z, 1.0))\n              + i.y + vec4(0.0, i1.y, i2.y, 1.0))\n              + i.x + vec4(0.0, i1.x, i2.x, 1.0));\n              \n        // Gradients: 7x7 points over a square, mapped onto an octahedron.\n        float n_ = 0.142857142857;\n        vec3 ns = n_ * D.wyz - D.xzx;\n        \n        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);\n        \n        vec4 x_ = floor(j * ns.z);\n        vec4 y_ = floor(j - 7.0 * x_);\n        \n        vec4 x = x_ *ns.x + ns.yyyy;\n        vec4 y = y_ *ns.x + ns.yyyy;\n        vec4 h = 1.0 - abs(x) - abs(y);\n        \n        vec4 b0 = vec4(x.xy, y.xy);\n        vec4 b1 = vec4(x.zw, y.zw);\n        \n        vec4 s0 = floor(b0)*2.0 + 1.0;\n        vec4 s1 = floor(b1)*2.0 + 1.0;\n        vec4 sh = -step(h, vec4(0.0));\n        \n        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;\n        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;\n        \n        vec3 p0 = vec3(a0.xy, h.x);\n        vec3 p1 = vec3(a0.zw, h.y);\n        vec3 p2 = vec3(a1.xy, h.z);\n        vec3 p3 = vec3(a1.zw, h.w);\n        \n        // Normalise gradients\n        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));\n        p0 *= norm.x;\n        p1 *= norm.y;\n        p2 *= norm.z;\n        p3 *= norm.w;\n        \n        // Mix final noise value\n        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n        m = m * m;\n        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));\n      }\n      \n      void main() {\n        vUv = uv;\n        vNormal = normal;\n        vPosition = position;\n        \n        // Calculate noise based on position and time\n        float noise = snoise(vec3(position.x * 2.0, position.y * 2.0, position.z * 2.0 + time * 0.5));\n        \n        // Add subtle pulsing effect based on time and interaction intensity\n        float pulse = sin(time * 2.0) * 0.05 * intensity;\n        \n        // Add mouse influence\n        float mouseInfluence = 0.0;\n        if (abs(mouseX) > 0.01 || abs(mouseY) > 0.01) {\n          vec3 mouseDir = normalize(vec3(mouseX, mouseY, 0.0));\n          mouseInfluence = max(0.0, dot(normalize(position), mouseDir)) * intensity * 0.2;\n        }\n        \n        // Apply deformation\n        vec3 newPosition = position * (1.0 + pulse + noise * 0.1 * intensity + mouseInfluence);\n        \n        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);\n      }\n    ",
    fragmentShader: "\n      uniform float time;\n      uniform vec3 color;\n      uniform float intensity;\n      \n      varying vec2 vUv;\n      varying vec3 vNormal;\n      varying vec3 vPosition;\n      \n      void main() {\n        // Calculate fresnel effect for edge glow\n        vec3 viewDirection = normalize(cameraPosition - vPosition);\n        float fresnel = pow(1.0 - dot(vNormal, viewDirection), 3.0);\n        \n        // Base color with pulsing\n        vec3 baseColor = color * (0.8 + 0.2 * sin(time * 2.0));\n        \n        // Add glow at edges\n        vec3 finalColor = mix(baseColor, vec3(1.0, 1.0, 1.0), fresnel * 0.7);\n        \n        // Add subtle patterns\n        float pattern = sin(vUv.x * 20.0 + time) * sin(vUv.y * 20.0 + time) * 0.1;\n        finalColor += pattern * intensity * color;\n        \n        // Brighten based on interaction intensity\n        finalColor *= 1.0 + intensity * 0.5;\n        \n        gl_FragColor = vec4(finalColor, 1.0);\n      }\n    ",
    transparent: true
  }); // Tạo mesh từ geometry và material

  var sphere = new THREE.Mesh(geometry, material);
  return sphere;
}; // Cập nhật quả cầu tình yêu


exports.createLoveSphere = createLoveSphere;

var updateLoveSphere = function updateLoveSphere(sphere, time, intensity, mouseX, mouseY) {
  if (!sphere || !sphere.material || !sphere.material.uniforms) return; // Cập nhật các uniform cho shader

  sphere.material.uniforms.time.value = time;
  sphere.material.uniforms.intensity.value = intensity;
  sphere.material.uniforms.mouseX.value = mouseX;
  sphere.material.uniforms.mouseY.value = mouseY; // Thêm chuyển động xoay nhẹ

  sphere.rotation.y = time * 0.2;
  sphere.rotation.z = time * 0.1;
};

exports.updateLoveSphere = updateLoveSphere;