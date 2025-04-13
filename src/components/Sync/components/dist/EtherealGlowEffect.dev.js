"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEtherealGlowEffect = void 0;

var THREE = _interopRequireWildcard(require("three"));

var _ShaderPass = require("three/examples/jsm/postprocessing/ShaderPass");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// src/components/Sync/components/EtherealGlowEffect.js
var createEtherealGlowEffect = function createEtherealGlowEffect() {
  var shader = {
    uniforms: {
      tDiffuse: {
        value: null
      },
      time: {
        value: 0
      },
      glowIntensity: {
        value: 0.5
      }
    },
    vertexShader: "\n      varying vec2 vUv;\n      void main() {\n        vUv = uv;\n        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n      }\n    ",
    fragmentShader: "\n      uniform sampler2D tDiffuse;\n      uniform float time;\n      uniform float glowIntensity;\n      varying vec2 vUv;\n      void main() {\n        vec4 color = texture2D(tDiffuse, vUv);\n        float glow = sin(time) * 0.5 + 0.5;\n        color.rgb += color.rgb * glow * glowIntensity;\n        gl_FragColor = color;\n      }\n    "
  };
  var pass = new _ShaderPass.ShaderPass(shader);
  pass.renderToScreen = true;
  return pass;
};

exports.createEtherealGlowEffect = createEtherealGlowEffect;