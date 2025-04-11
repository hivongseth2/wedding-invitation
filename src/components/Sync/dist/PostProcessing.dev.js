"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPostProcessing = void 0;

var THREE = _interopRequireWildcard(require("three"));

var _EffectComposer = require("three/examples/jsm/postprocessing/EffectComposer.js");

var _RenderPass = require("three/examples/jsm/postprocessing/RenderPass.js");

var _UnrealBloomPass = require("three/examples/jsm/postprocessing/UnrealBloomPass.js");

var _ShaderPass = require("three/examples/jsm/postprocessing/ShaderPass.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var createPostProcessing = function createPostProcessing(renderer, scene, camera) {
  // Add post-processing for glow effect
  var renderScene = new _RenderPass.RenderPass(scene, camera); // Tối ưu hóa bloom pass

  var bloomPass = new _UnrealBloomPass.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.0, // Giảm strength
  0.4, // Radius
  0.1);
  // Add custom ethereal glow effect
  var etherealGlowPass = createEtherealGlowEffect();
  var composer = new _EffectComposer.EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);
  composer.addPass(etherealGlowPass);
  return composer;
}; // Custom post-processing effect for ethereal glow


exports.createPostProcessing = createPostProcessing;

var createEtherealGlowEffect = function createEtherealGlowEffect() {
  var vertexShader = "\n    varying vec2 vUv;\n    void main() {\n      vUv = uv;\n      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    }\n  ";
  var fragmentShader = "\n    uniform sampler2D tDiffuse;\n    varying vec2 vUv;\n    \n    void main() {\n      vec4 color = texture2D(tDiffuse, vUv);\n      \n      // Enhance the glow\n      color.rgb = pow(color.rgb, vec3(0.85));\n      \n      // Add a subtle vignette effect\n      vec2 uv = vUv * 2.0 - 1.0;\n      float vignetteAmount = 1.0 - dot(uv, uv) * 0.3;\n      color.rgb *= vignetteAmount;\n      \n      gl_FragColor = color;\n    }\n  ";
  return new _ShaderPass.ShaderPass({
    uniforms: {
      tDiffuse: {
        value: null
      }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  });
};